import { useState } from 'react';
import API from '../api/axios';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPassword() {
  useDocumentTitle('Recuperar Contraseña');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch {
      setMessage('Ocurrió un error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Recuperar Contraseña
        </h1>

        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" fullWidth>
            Enviar Enlace
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          ¿Ya recuerdas tu contraseña?{' '}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
