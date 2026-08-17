import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { sendResetEmail } from '../lib/email';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    // Lógica de rol: El primer usuario es ADMIN, el resto USER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    // NUEVO: Verificar si el usuario tiene contraseña (si no se registró con Google)
    if (!user.password) {
      return res
        .status(400)
        .json({
          message:
            'Esta cuenta se registró con Google. Por favor, inicia sesión con el botón de Google.',
        });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Aquí ya no dará error
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, siempre decimos que fue exitoso, aunque el email no exista.
      return res.json({ message: 'Si el correo existe, se enviará un enlace.' });
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    await sendResetEmail(user.email, token);
    res.json({ message: 'Si el correo existe, se enviará un enlace.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // gt = mayor que ahora
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // 1. Verificar el token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Token inválido' });

    const { sub: googleId, email, name, picture } = payload;

    // 2. Buscar o crear el usuario en nuestra BD
    let user = await prisma.user.findUnique({ where: { email: email! } });

    if (!user) {
      // Si no existe, crearlo
      user = await prisma.user.create({
        data: {
          email: email!,
          name: name || null,
          image: picture || null,
          googleId: googleId,
          role: 'USER', // Los de Google siempre son USER por defecto
        },
      });
    } else if (!user.googleId) {
      // Si ya existía pero se registró con correo/contraseña, le vinculamos el googleId
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    // 3. Generar NUESTRO token de sesión
    const appToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    res.json({ token: appToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en autenticación de Google' });
  }
};
