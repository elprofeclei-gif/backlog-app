import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BoardModel } from '../models/board.model';
import type { Board } from '../models/board.model';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function Home() {
  useDocumentTitle('Mis Tableros');
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('blue');

  const auth = useAuth();
  const navigate = useNavigate();

  const colors = [
    { id: 'blue', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { id: 'green', bg: 'bg-green-600', hover: 'hover:bg-green-700' },
    { id: 'purple', bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    { id: 'orange', bg: 'bg-orange-600', hover: 'hover:bg-orange-700' },
    { id: 'pink', bg: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    { id: 'indigo', bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar superior */}
      <nav className="bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Aquí está nuestro nuevo Logo */}
          <Logo size={36} />
          <h1 className="text-xl font-bold text-gray-800">Backlog</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/profile')} className="text-sm">
            Mi Perfil
          </Button>
          <Button variant="danger" onClick={handleLogout} className="text-sm">
            Cerrar Sesión
          </Button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tus Tableros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Botón Crear Tablero */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="h-32 rounded-xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors shadow-sm"
          >
            <div className="text-center">
              <div className="text-4xl mb-1">+</div>
              <div className="text-sm font-semibold">Crear nuevo tablero</div>
            </div>
          </button>

          {/* Tableros existentes */}
          {boards.map((board) => {
            const colorClass = colors.find((c) => c.id === board.color)?.bg || 'bg-blue-600';
            const hoverClass =
              colors.find((c) => c.id === board.color)?.hover || 'hover:bg-blue-700';
            return (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className={`h-32 rounded-xl ${colorClass} p-4 cursor-pointer ${hoverClass} transition-all relative group shadow-md hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Calculamos el total de tarjetas sumando las listas de forma segura */}
                {(() => {
                  const totalTasks =
                    board.lists?.reduce((acc, list) => acc + (list._count?.tasks || 0), 0) || 0;
                  return (
                    <>
                      <h3 className="font-bold text-lg text-white drop-shadow">{board.title}</h3>
                      <p className="text-white/80 text-sm font-medium">
                        {totalTasks} {totalTasks === 1 ? 'tarea' : 'tareas'}
                      </p>
                    </>
                  );
                })()}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Eliminar este tablero?')) {
                      BoardModel.delete(board.id);
                      setBoards(boards.filter((b) => b.id !== board.id));
                    }
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/30 hover:bg-red-600 p-1.5 rounded-md text-white text-xs transition-all"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal para crear tablero */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Crear nuevo tablero</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del tablero
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Ej: Proyecto Personal"
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de fondo
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setNewBoardColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.bg} ${newBoardColor === color.id ? 'ring-2 ring-gray-800 ring-offset-2' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" fullWidth>
                  Crear
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
