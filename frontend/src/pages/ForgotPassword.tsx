import { useState } from 'react';
import API from '../api/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const schema = z.object({
  email: z.string().min(1, 'El email es requerido').email('El email no es válido'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  useDocumentTitle('Recuperar Contraseña');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setMessage('');

    try {
      const { data: resData } = await API.post('/auth/forgot-password', { email: data.email });
      setMessage(resData.message);
    } catch {
      setMessage('Ocurrió un error.');
    } finally {
      setIsLoading(false);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Button type="submit" fullWidth isLoading={isLoading} disabled={!isValid}>
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
