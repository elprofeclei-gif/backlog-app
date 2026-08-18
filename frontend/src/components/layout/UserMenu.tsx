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
    : 'p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

  const wrapperClasses = transparent
    ? 'flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-black/20 transition-colors'
    : 'flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

  const nameClasses = transparent
    ? 'text-sm font-medium text-white hidden sm:block'
    : 'text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block';

  return (
    <div className="flex items-center gap-4">
      <button onClick={toggleTheme} className={btnClasses}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className={wrapperClasses}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden border-2 border-white/30">
            {user?.image ? (
              <img
                src={user.image}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              initial
            )}
          </div>
          <span className={nameClasses}>{user?.name || user?.email}</span>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                👤 Mi Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
