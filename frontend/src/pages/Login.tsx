import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

export default function Login() {
  useDocumentTitle('Iniciar Sesión');

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name };

      const { data } = await API.post(endpoint, payload);
      auth.login(data.token);
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Logo y Bienvenida */}
        <div className="flex flex-col items-center mb-8">
          <Logo size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin
              ? 'Inicia sesión para acceder a tus tableros'
              : 'Empieza a organizar tus proyectos hoy'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Botón de Google */}
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

        {/* Separador */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-xs font-semibold uppercase">o con tu email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <Input
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth className="text-base py-2.5">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <p className="text-sm text-gray-500">
              ¿Olvidaste tu contraseña?{' '}
              <a href="/forgot-password" className="text-blue-600 font-semibold hover:underline">
                Recuperar
              </a>
            </p>
          )}
          <p className="text-sm text-gray-600 pt-2 border-t border-gray-100">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
