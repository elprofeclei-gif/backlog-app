import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../models/user.model';
import type { AxiosError } from 'axios';

export default function Profile() {
  const navigate = useNavigate();

  // Estados de datos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState<string | null>(null); // <-- Nuevo estado para imagen

  // Estados de formularios
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserModel.getMe();
      setName(user.name || '');
      setEmail(user.email);
      setRole(user.role);
      setImage(user.image); // <-- Guardar la imagen si ya tiene una
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserModel.updateMe(name);
      setMessage('Perfil actualizado correctamente');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserModel.changePassword(currentPassword, newPassword);
      setMessage('Contraseña actualizada correctamente');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  // Nueva función para manejar la subida de imagen
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedUser = await UserModel.uploadAvatar(file);
      setImage(updatedUser.image);
      setMessage('Foto de perfil actualizada');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Error al subir la imagen');
    }
  };

  const initial = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Mi Perfil</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
        >
          Volver al Tablero
        </button>
      </nav>

      {/* Header del Perfil con Avatar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center space-x-6">
          {/* Contenedor del Avatar y botón de cámara */}
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md overflow-hidden">
              {image ? (
                <img src={image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
            {/* Botón de cámara (Label que dispara el input file) */}
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 border border-gray-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">{name || 'Usuario sin nombre'}</h2>
            <p className="text-gray-600 text-lg">{email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-xs font-bold rounded-full ${role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}
            >
              {role === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {message && (
          <div className="md:col-span-3 bg-green-100 text-green-700 p-3 rounded text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="md:col-span-3 bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>
        )}

        {/* Tarjeta: Datos de la cuenta */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Datos de la cuenta</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (no editable)</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-md bg-gray-50 border-gray-200 p-2 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 font-semibold text-sm transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>

        {/* Tarjeta: Seguridad */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Seguridad</h3>

          {!showPasswordForm ? (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Contraseña</p>
                <p className="text-xs text-gray-500">Última actualización: hace un tiempo</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                Cambiar contraseña
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4 transition-all">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold text-sm transition-colors"
                >
                  Actualizar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
