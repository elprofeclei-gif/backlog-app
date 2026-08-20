import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../../models/user.model';
import type { User } from '../../models/user.model';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function UserMenu({ transparent = false }: { transparent?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    UserModel.getMe().then(setUser).catch(console.error);
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  const btnClasses = transparent
    ? 'p-2 rounded-lg text-white/80 hover:bg-black/20 transition-colors'
    : 'p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors';

  const wrapperClasses = transparent
    ? 'flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-black/20 transition-colors'
    : 'flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

  const nameClasses = transparent
    ? 'text-sm font-semibold text-white hidden sm:block'
    : 'text-sm font-semibold text-gray-700 dark:text-gray-200 hidden sm:block';

  return (
    <div className="flex items-center gap-2">
      {/* Botón de Tema (Modo Oscuro/Claro) */}
      <button onClick={toggleTheme} className={btnClasses}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className={wrapperClasses}>
          <div
            className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden ${transparent ? 'border border-white/30' : ''}`}
          >
            {user?.image ? (
              <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <span className={nameClasses}>{user?.name || user?.email}</span>
          {/* Flecha que rota al abrir el menú */}
          <svg
            className={`w-4 h-4 ${transparent ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'} transition-transform ${showMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            {/* Fondo invisible para cerrar al hacer clic fuera */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>

            {/* Menú Desplegable Profesional */}
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mi Perfil
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
