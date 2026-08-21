import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import UserMenu from '../components/layout/UserMenu';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface Stats {
  totalUsers: number;
  totalBoards: number;
  totalLists: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

export default function AdminDashboard() {
  useDocumentTitle('Panel Admin');
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/users/stats');
        setStats(data);
      } catch {
        // Si hay un error (ej: no es admin), lo redirigimos al inicio
        toast.error('No tienes permisos o falló la red');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  // Función robusta para descargar archivos manejando errores binarios
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await API.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Limpiar memoria
      toast.success('Descarga iniciada');
    } catch (err) {
      // Tipamos el error sin usar 'any'
      const error = err as { response?: { data?: Blob | { message?: string } } };

      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          toast.error(json.message || 'Error al descargar');
        } catch {
          toast.error('Error al descargar el archivo');
        }
      } else {
        toast.error('Error de red al descargar');
      }
    }
  };

  const cards = [
    {
      title: 'Usuarios Registrados',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Tableros Creados',
      value: stats?.totalBoards || 0,
      icon: '📋',
      color: 'bg-purple-500',
    },
    {
      title: 'Listas Creadas', // <-- Nuevo
      value: stats?.totalLists || 0,
      icon: '📝',
      color: 'bg-teal-500',
    },
    { title: 'Tareas Totales', value: stats?.totalTasks || 0, icon: '📝', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-semibold"
          >
            ← Inicio
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            👑 Panel de Administrador
          </h1>
        </div>
        <UserMenu />
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {card.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-full ${card.color} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Progreso de Completado Global
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
                      style={{ width: `${stats?.completionRate || 0}%` }}
                    >
                      <span className="text-xs text-white font-bold pr-2">
                        {stats?.completionRate || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>✅ Completadas: {stats?.completedTasks || 0}</span>
                    <span>⏳ Pendientes: {stats?.pendingTasks || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de descargas actualizada con Grid de 6 botones */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-purple-200 dark:border-purple-900">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Descargas y Respaldos de Base de Datos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Descarga cada tabla de la base de datos en formato CSV (para abrir en Excel) o el
                respaldo completo en JSON.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload('/users/backup?format=csv&table=users', 'usuarios.csv')
                  }
                >
                  👥 Descargar Usuarios (CSV)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload('/users/backup?format=csv&table=boards', 'tableros.csv')
                  }
                >
                  📋 Descargar Tableros (CSV)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload('/users/backup?format=csv&table=lists', 'listas.csv')
                  }
                >
                  📝 Descargar Listas (CSV)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload('/users/backup?format=csv&table=tasks', 'tareas.csv')
                  }
                >
                  ✅ Descargar Tareas (CSV)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownload('/users/report/activity', 'reporte_actividad.csv')}
                >
                  📈 Descargar Actividad (CSV)
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload('/users/backup?format=json', 'backup_completo.json')
                  }
                >
                  📦 Backup General (JSON)
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
