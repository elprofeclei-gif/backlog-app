import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardController } from '../controllers/useBoard';
import type { Task } from '../models/task.model';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DraggableProvided } from '@hello-pangea/dnd';
import UserMenu from '../components/layout/UserMenu';
import toast from 'react-hot-toast';

const boardColors: Record<string, string> = {
  blue: 'bg-blue-800',
  green: 'bg-green-800',
  purple: 'bg-purple-800',
  orange: 'bg-orange-800',
  pink: 'bg-pink-800',
  indigo: 'bg-indigo-800',
  red: 'bg-red-800',
  teal: 'bg-teal-800',
  amber: 'bg-amber-800',
  cyan: 'bg-cyan-800',
  rose: 'bg-rose-800',
  slate: 'bg-slate-800',
};

const swatchColors = [
  'blue',
  'green',
  'purple',
  'orange',
  'pink',
  'indigo',
  'red',
  'teal',
  'amber',
  'cyan',
  'rose',
  'slate',
];

const labelColors: Record<string, string> = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

export default function Dashboard() {
  const [newListTitle, setNewListTitle] = useState('');
  const [addingList, setAddingList] = useState(false);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const listFormRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    lists,
    board,
    loading,
    addList,
    removeList,
    editList,
    editBoardTitle,
    editBoardColor,
    addTask,
    removeTask,
    editTask,
    setTaskDueDate,
    setTaskLabel,
    toggleComplete,
    onDragEnd,
  } = useBoardController(boardId!);

  const totalLists = lists.length;
  const totalTasks = lists.reduce((acc, list) => acc + list.tasks.length, 0);

  useEffect(() => {
    if (!addingList && !isPickingColor) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addingList &&
        listFormRef.current &&
        !listFormRef.current.contains(event.target as Node)
      ) {
        setAddingList(false);
        setNewListTitle('');
      }
      if (
        isPickingColor &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setIsPickingColor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [addingList, isPickingColor]);

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    try {
      await addList(newListTitle);
      toast.success('Lista creada');
      setNewListTitle('');
      setAddingList(false);
    } catch {
      toast.error('Error al crear la lista');
    }
  };

  const bgColor = board ? boardColors[board.color] || 'bg-blue-800' : 'bg-blue-800';

  return (
    <div
      className={`min-h-screen ${bgColor} text-white flex flex-col transition-colors duration-300`}
    >
      <nav className="bg-black/20 backdrop-blur-sm p-4 flex justify-between items-center flex-wrap gap-4 relative z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm font-semibold"
          >
            ← Inicio
          </button>
          <EditableText
            initialText={board?.title || 'Cargando...'}
            onEdit={async (newTitle) => {
              try {
                await editBoardTitle(newTitle);
                toast('Tablero actualizado');
              } catch {
                toast.error('Error al actualizar tablero');
              }
            }}
            className="text-xl font-bold text-white hover:bg-white/20 px-2 py-1 rounded transition-colors"
          />

          {/* BOTÓN DE PALETA DE COLORES PROFESIONAL */}
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => setIsPickingColor(!isPickingColor)}
              className="flex items-center gap-1.5 text-white/80 hover:text-white px-2 py-1 rounded-md hover:bg-white/20 transition-colors text-sm font-medium"
            >
              🎨 <span className="hidden sm:inline">Fondo</span>
            </button>

            {isPickingColor && (
              <div className="absolute top-12 left-0 w-56 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                  Color del tablero
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {swatchColors.map((c) => (
                    <button
                      key={c}
                      onClick={async () => {
                        try {
                          await editBoardColor(c);
                          toast('Color actualizado');
                        } catch {
                          toast.error('Error al actualizar color');
                        }
                        setIsPickingColor(false);
                      }}
                      className={`w-9 h-9 rounded-lg ${boardColors[c]} transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${board?.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="font-bold text-white">{totalLists}</span>
                <span className="text-white/70">Listas</span>
              </div>
              <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="font-bold text-white">{totalTasks}</span>
                <span className="text-white/70">Tarjetas</span>
              </div>
            </div>
          )}
          <UserMenu transparent />
        </div>
      </nav>

      <div className="p-4 flex-1 overflow-x-auto relative z-0">
        {loading ? (
          <div className="flex gap-3 items-start">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-72 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <Droppable droppableId="all-lists" direction="horizontal" type="list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col md:flex-row gap-3 items-start"
                  >
                    {lists.map((list, index) => (
                      <Draggable draggableId={list.id} index={index} key={list.id}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <div className="w-full md:w-72 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg flex flex-col max-h-[80vh]">
                              <div className="p-3 flex justify-between items-center gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <EditableText
                                    initialText={list.title}
                                    onEdit={async (newTitle) => {
                                      try {
                                        await editList(list.id, newTitle);
                                        toast('Lista actualizada');
                                      } catch {
                                        toast.error('Error al actualizar lista');
                                      }
                                    }}
                                    className="font-bold text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                                  />
                                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
                                    {list.tasks.length}
                                  </span>
                                </div>

                                <button
                                  onClick={() => {
                                    toast(
                                      (t) => (
                                        <div className="flex flex-col gap-2">
                                          <span>
                                            ¿Eliminar esta lista? Se borrarán sus tarjetas.
                                          </span>
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
                                                  await removeList(list.id);
                                                  toast.success('Lista eliminada');
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
                                  className="text-gray-500 hover:text-red-600 text-sm"
                                >
                                  🗑️
                                </button>
                              </div>

                              <Droppable droppableId={list.id} type="task">
                                {(prov) => (
                                  <div
                                    ref={prov.innerRef}
                                    {...prov.droppableProps}
                                    className="px-2 flex-1 overflow-y-auto min-h-[100px]"
                                  >
                                    {list.tasks.map((task, index) => (
                                      <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(p) => (
                                          <TaskItem
                                            task={task}
                                            innerRef={p.innerRef}
                                            draggableProps={p.draggableProps}
                                            dragHandleProps={p.dragHandleProps}
                                            onEdit={editTask}
                                            onToggle={toggleComplete}
                                            onDelete={removeTask}
                                            onSetDueDate={setTaskDueDate}
                                            onSetLabel={setTaskLabel}
                                            listId={list.id}
                                          />
                                        )}
                                      </Draggable>
                                    ))}
                                    {prov.placeholder}
                                  </div>
                                )}
                              </Droppable>

                              <AddCardForm
                                onAdd={async (title) => {
                                  try {
                                    await addTask(list.id, title);
                                    toast.success('Tarjeta creada');
                                  } catch {
                                    toast.error('Error al crear tarjeta');
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="w-full md:w-72 flex-shrink-0 mt-0" ref={listFormRef}>
                {addingList ? (
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow-lg">
                    <form onSubmit={handleAddList}>
                      <input
                        autoFocus
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        placeholder="Introduce el título de la lista..."
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold"
                        >
                          Añadir lista
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingList(false);
                            setNewListTitle('');
                          }}
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 px-2"
                        >
                          ✖
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingList(true)}
                    className="w-full bg-black/20 hover:bg-black/40 text-white py-3 rounded text-left px-4 font-semibold transition-colors"
                  >
                    + Añade otra lista
                  </button>
                )}
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

function EditableText({
  initialText,
  onEdit,
  className,
}: {
  initialText: string;
  onEdit: (newText: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleStartEditing = () => {
    setText(initialText);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onEdit(text);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSubmit}
          className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-white dark:bg-gray-700"
        />
      </form>
    );
  }

  return (
    <span className={`cursor-pointer ${className}`} onClick={handleStartEditing}>
      {initialText || 'Sin título'}
    </span>
  );
}

function TaskItem({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
  onEdit,
  onToggle,
  onDelete,
  onSetDueDate,
  onSetLabel,
  listId,
}: {
  task: Task;
  innerRef: DraggableProvided['innerRef'];
  draggableProps: DraggableProvided['draggableProps'];
  dragHandleProps: DraggableProvided['dragHandleProps'];
  onEdit: (id: string, title: string) => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (listId: string, taskId: string) => void;
  onSetDueDate: (taskId: string, dueDate: string | null) => Promise<boolean>;
  onSetLabel: (taskId: string, label: string | null) => Promise<boolean>;
  listId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isPickingDate, setIsPickingDate] = useState(false);
  const [isPickingLabel, setIsPickingLabel] = useState(false);

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(task.title);
    setIsEditing(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onEdit(task.id, title);
      toast('Tarjeta actualizada');
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setIsEditing(false);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id, task.completed);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>¿Eliminar esta tarjeta?</span>
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
                  await onDelete(listId, task.id);
                  toast.success('Tarjeta eliminada');
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
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    : '';

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm mb-2 cursor-grab active:cursor-grabbing relative overflow-hidden"
    >
      {task.label && (
        <div className={`absolute top-0 left-0 w-full h-1.5 ${labelColors[task.label]}`}></div>
      )}

      {isEditing ? (
        <div className="flex gap-1 mt-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-1 text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-2 rounded text-xs">
            ✓
          </button>
        </div>
      ) : (
        <div className="mt-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={handleToggle}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 dark:border-gray-500 hover:border-green-500'}`}
              >
                {task.completed && <span className="text-white text-xs">✓</span>}
              </button>

              <span
                className={`text-sm text-gray-800 dark:text-gray-200 break-all ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
              >
                {task.title}
              </span>
            </div>

            <div className="flex gap-1 ml-2 flex-shrink-0">
              <button
                onClick={handleStartEditing}
                className="text-gray-400 hover:text-blue-600 text-xs"
              >
                ✏️
              </button>
              <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 text-xs">
                🗑️
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {isPickingLabel ? (
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await onSetLabel(task.id, null);
                    setIsPickingLabel(false);
                    toast('Etiqueta quitada');
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 px-1"
                >
                  ✖
                </button>
                {Object.entries(labelColors).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onSetLabel(task.id, key);
                      setIsPickingLabel(false);
                      toast('Etiqueta actualizada');
                    }}
                    className={`w-4 h-4 rounded-full ${value} hover:scale-110 transition-transform`}
                  />
                ))}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPickingLabel(true);
                }}
                className="text-xs px-2 py-1 rounded flex items-center gap-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                🏷️
              </button>
            )}

            {isPickingDate ? (
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                  onChange={async (e) => {
                    try {
                      await onSetDueDate(task.id, e.target.value || null);
                      toast('Fecha actualizada');
                    } catch {
                      toast.error('Error al guardar fecha');
                    }
                  }}
                  className="p-1 text-xs border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPickingDate(false);
                  }}
                  className="text-gray-500 text-xs"
                >
                  ✖
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPickingDate(true);
                }}
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 font-bold' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
              >
                📅 {task.dueDate ? formattedDate : 'Fecha'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddCardForm({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!adding) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAdding(false);
        setTitle('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await onAdd(title);
      setTitle('');
      setAdding(false);
    } catch {
      // El error ya lo maneja el padre
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (title.trim()) handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setAdding(false);
    }
  };

  if (adding) {
    return (
      <form onSubmit={handleSubmit} ref={formRef} className="p-2">
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Introduce un título para esta tarjeta..."
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          rows={3}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold"
          >
            Añadir tarjeta
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 px-2"
          >
            ✖
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setAdding(true)}
      className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left py-2 px-3 text-sm rounded-b-lg transition-colors"
    >
      + Añade una tarjeta
    </button>
  );
}
