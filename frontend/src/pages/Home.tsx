import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardModel } from '../models/board.model';
import type { Board } from '../models/board.model';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

export default function Home() {
  useDocumentTitle('Mis Tableros');
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('blue');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    setIsCreating(true);
    try {
      const newBoard = await BoardModel.create(newBoardTitle, newBoardColor);
      setBoards([newBoard, ...boards]);
      setNewBoardTitle('');
      setShowCreateForm(false);
      toast.success('Tablero creado con éxito');
      navigate(`/board/${newBoard.id}`);
    } catch (error) {
      toast.error('Error al crear el tablero');
      console.error('Error al crear tablero:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const reorderedBoards = Array.from(boards);
    const [movedBoard] = reorderedBoards.splice(source.index, 1);
    reorderedBoards.splice(destination.index, 0, movedBoard);

    const newOrderBoards = reorderedBoards.map((b, index) => ({ ...b, order: index }));
    setBoards(newOrderBoards);

    try {
      const payload = newOrderBoards.map((b) => ({ id: b.id, order: b.order! }));
      await BoardModel.reorder(payload);
    } catch {
      toast.error('Error al reordenar tableros');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {!loading && (
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tus Tableros</h2>
            <div className="flex gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-semibold text-sm">
                {boards.length} Tableros
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg font-semibold text-sm">
                {boards.reduce(
                  (acc, board) =>
                    acc +
                    (board.lists?.reduce((lAcc, list) => lAcc + (list._count?.tasks || 0), 0) || 0),
                  0
                )}{' '}
                Tarjetas Totales
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="boards" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="h-32 rounded-xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 transition-colors shadow-sm"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-1">+</div>
                      <div className="text-sm font-semibold">Crear nuevo tablero</div>
                    </div>
                  </button>

                  {boards.map((board, index) => {
                    const colorClass =
                      colors.find((c) => c.id === board.color)?.bg || 'bg-blue-600';
                    const hoverClass =
                      colors.find((c) => c.id === board.color)?.hover || 'hover:bg-blue-700';
                    const totalTasks =
                      board.lists?.reduce((acc, list) => acc + (list._count?.tasks || 0), 0) || 0;
                    return (
                      <Draggable key={board.id} draggableId={board.id} index={index}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onClick={() => navigate(`/board/${board.id}`)}
                            className={`h-32 rounded-xl ${colorClass} p-4 cursor-pointer ${hoverClass} transition-all relative group shadow-md hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between`}
                          >
                            <h3 className="font-bold text-lg text-white drop-shadow">
                              {board.title}
                            </h3>
                            <p className="text-white/80 text-sm font-medium">
                              {totalTasks} {totalTasks === 1 ? 'tarea' : 'tareas'}
                            </p>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toast(
                                  (t) => (
                                    <div className="flex flex-col gap-2">
                                      <span>¿Eliminar este tablero?</span>
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={() => toast.dismiss(t.id)}
                                          className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          onClick={async () => {
                                            toast.dismiss(t.id);
                                            try {
                                              await BoardModel.delete(board.id);
                                              setBoards(boards.filter((b) => b.id !== board.id));
                                              toast.success('Tablero eliminado');
                                            } catch {
                                              toast.error('Error al eliminar');
                                            }
                                          }}
                                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                  { duration: 5000 }
                                );
                              }}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/30 hover:bg-red-600 p-1.5 rounded-md text-white text-xs transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Crear nuevo tablero
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título del tablero
                </label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Ej: Proyecto Personal"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color de fondo
                </label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setNewBoardColor(color.id)}
                      className={`w-8 h-8 rounded-full ${color.bg} ${newBoardColor === color.id ? 'ring-2 ring-gray-800 dark:ring-white ring-offset-2 dark:ring-offset-gray-800' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" fullWidth isLoading={isCreating}>
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
