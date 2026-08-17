import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (to: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev', // Email de prueba de Resend
    to: to,
    subject: 'Recuperación de Contraseña - Backlog',
    html: `
      <h1>Recuperación de Contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  });
};
