import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { name, image } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, image },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // ¡ESTO ES LO QUE FALTA AGREGAR!
    if (!user.password) {
      return res
        .status(400)
        .json({ message: 'Esta cuenta no usa contraseña. Inicia sesión con Google.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'La contraseña actual es incorrecta' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// --- RUTAS DE ADMIN ---
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Ver un usuario por ID (Solo Admin)
export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, image: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar a cualquier usuario (Solo Admin)
export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, image, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, image, role },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Subir imagen de perfil
export const uploadAvatar = async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    // @ts-ignore (Multer añade req.file al objeto request)
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen' });
    }

    // Construimos la URL completa: http://localhost:3001/uploads/123456789.jpg
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: { id: true, email: true, name: true, image: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir la imagen' });
  }
};
