import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../api/axios';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

// 1. Esquema de validación
const schema = z.object({
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
  useDocumentTitle('Nueva Contraseña');
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 2. Inicializamos React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    delayError: 500,
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error('Token inválido o faltante.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const { data: resData } = await API.post('/auth/reset-password', {
        token,
        newPassword: data.newPassword,
      });
      setMessage(resData.message);
      toast.success('Contraseña restablecida correctamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Error al restablecer contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Nueva Contraseña
        </h1>

        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nueva Contraseña"
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            required
          />
          <Button type="submit" fullWidth isLoading={isLoading} disabled={!isValid}>
            Restablecer
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
