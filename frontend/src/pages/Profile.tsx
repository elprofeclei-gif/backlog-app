import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../models/user.model';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast'; // <-- Nuevo
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import UserMenu from '../components/layout/UserMenu';

export default function Profile() {
  useDocumentTitle('Mi Perfil');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserModel.getMe();
      setName(user.name || '');
      setEmail(user.email);
      setRole(user.role);
      setImage(user.image);
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await UserModel.updateMe(name);
      toast.success('Perfil actualizado correctamente'); // <-- Toast
    } catch {
      toast.error('Error al actualizar perfil'); // <-- Toast
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    try {
      await UserModel.changePassword(currentPassword, newPassword);
      toast.success('Contraseña actualizada correctamente'); // <-- Toast
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Error al cambiar contraseña'); // <-- Toast
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const updatedUser = await UserModel.uploadAvatar(file);
      setImage(updatedUser.image);
      toast.success('Foto de perfil actualizada'); // <-- Toast
    } catch {
      toast.error('Error al subir la imagen'); // <-- Toast
    }
  };

  const initial = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold"
          >
            ← Volver al Tablero
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
        </div>
        <UserMenu />
      </nav>

      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md overflow-hidden">
              {image ? (
                <img src={image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </div>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {name || 'Usuario sin nombre'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">{email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-xs font-bold rounded-full ${role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}
            >
              {role === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta: Datos de la cuenta */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Datos de la cuenta
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Email (no editable)"
              type="email"
              value={email}
              disabled
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <Input
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" isLoading={isSavingProfile}>
              Guardar cambios
            </Button>
          </form>
        </div>

        {/* Tarjeta: Seguridad */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Seguridad
          </h3>

          {!showPasswordForm ? (
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Última actualización: hace un tiempo
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowPasswordForm(true)}>
                Cambiar contraseña
              </Button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4 transition-all">
              <Input
                label="Contraseña Actual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="danger" isLoading={isChangingPass}>
                  Actualizar Contraseña
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
