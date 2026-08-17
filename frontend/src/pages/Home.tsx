import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BoardModel } from '../models/board.model';
import type { Board } from '../models/board.model';

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('blue');

  const auth = useAuth();
  const navigate = useNavigate();

  const colors = [
    { id: 'blue', bg: 'bg-blue-600' },
    { id: 'green', bg: 'bg-green-600' },
    { id: 'purple', bg: 'bg-purple-600' },
    { id: 'orange', bg: 'bg-orange-600' },
    { id: 'pink', bg: 'bg-pink-600' },
    { id: 'indigo', bg: 'bg-indigo-600' },
  ];

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await BoardModel.getAll();
        setBoards(data);
      } catch (error) {
        console.error('Error al cargar tableros:', error);
      }
    };
    fetchBoards();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const newBoard = await BoardModel.create(newBoardTitle, newBoardColor);
      setBoards([newBoard, ...boards]);
      setNewBoardTitle('');
      setShowCreateForm(false);
      navigate(`/board/${newBoard.id}`);
    } catch (error) {
      console.error('Error al crear tablero:', error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 min-h-screen p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">
            B
          </div>
          <h1 className="text-xl font-bold">Backlog</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <span>🏠</span> Inicio
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            <span>👤</span> Mi Perfil
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded hover:bg-red-600 flex items-center gap-2 text-red-400 hover:text-white transition-colors"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Tus Tableros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Botón Crear Tablero */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="h-32 rounded-lg bg-gray-800 hover:bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <div className="text-center">
              <div className="text-3xl mb-1">+</div>
              <div className="text-sm font-medium">Crear nuevo tablero</div>
            </div>
          </button>

          {/* Tableros existentes */}
          {boards.map((board) => {
            const colorClass = colors.find((c) => c.id === board.color)?.bg || 'bg-blue-600';
            // Sumar todas las tareas de las listas del tablero
            const totalTasks = board.lists?.reduce((acc, list) => acc + list._count.tasks, 0) || 0;

            return (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className={`h-32 rounded-lg ${colorClass} p-4 cursor-pointer hover:scale-105 transition-transform relative group flex flex-col justify-between`}
              >
                <h3 className="font-bold text-lg text-white">{board.title}</h3>
                {/* Mostrar el conteo total de tarjetas */}
                <p className="text-white/80 text-sm">
                  {totalTasks} {totalTasks === 1 ? 'tarea' : 'tareas'}
                </p>

                {/* Botón eliminar (aparece al hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Eliminar este tablero?')) {
                      BoardModel.delete(board.id);
                      setBoards(boards.filter((b) => b.id !== board.id));
                    }
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/30 hover:bg-red-600 p-1 rounded text-white text-sm transition-all"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal para crear tablero */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Crear nuevo tablero</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="Ej: Proyecto Personal"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setNewBoardColor(color.id)}
                        className={`w-8 h-8 rounded-full ${color.bg} ${newBoardColor === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
