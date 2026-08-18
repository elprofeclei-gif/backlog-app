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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperar Contraseña</h1>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
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

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Ya recuerdas tu contraseña?{' '}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
