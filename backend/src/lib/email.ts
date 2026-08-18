import { Resend } from 'resend';

// Variable para guardar la instancia solo cuando se necesite
let resendInstance: Resend | null = null;

const getResendInstance = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Falta la API key de Resend en el entorno');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

export const sendResetEmail = async (to: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  const resend = getResendInstance();

  await resend.emails.send({
    from: 'onboarding@resend.dev',
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
