import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

// 1. Esquema base con las validaciones que comparten ambos modos
const baseSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, 'El email es requerido').email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function Login() {
  useDocumentTitle('Iniciar Sesión');

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  // 2. Generamos el esquema dinámicamente según el modo (Login o Registro)
  const schema = useMemo(() => {
    return baseSchema.superRefine((data, ctx) => {
      // Si NO estamos en modo login y el nombre está vacío, lanzamos error
      if (!isLogin && !data.name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El nombre es requerido',
          path: ['name'],
        });
      }
    });
  }, [isLogin]);

  type FormValues = z.infer<typeof baseSchema>;

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
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, name: data.name };

      const { data: resData } = await API.post(endpoint, payload);
      auth.login(resData.token);
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Ocurrió un error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <Logo size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isLogin
              ? 'Inicia sesión para acceder a tus tableros'
              : 'Empieza a organizar tus proyectos hoy'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const { data } = await API.post('/auth/google', {
                  token: credentialResponse.credential,
                });
                auth.login(data.token);
                navigate('/');
              } catch {
                setError('Error al iniciar sesión con Google');
              }
            }}
            onError={() => {
              setError('Error con el login de Google');
            }}
            text="continue_with"
            shape="circle"
          />
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase">
            o con tu email
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!isLogin && (
            <Input
              label="Nombre completo"
              type="text"
              {...register('name')}
              error={errors.name?.message}
            />
          )}
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input
            label="Contraseña"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={!isValid}
            className="text-base py-2.5"
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Olvidaste tu contraseña?{' '}
              <a
                href="/forgot-password"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Recuperar
              </a>
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
