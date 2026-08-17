import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBoardController } from '../controllers/useBoard';
import type { Task } from '../models/task.model';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DraggableProvided } from '@hello-pangea/dnd';

const boardColors: Record<string, string> = {
  blue: 'bg-blue-800',
  green: 'bg-green-800',
  purple: 'bg-purple-800',
  orange: 'bg-orange-800',
  pink: 'bg-pink-800',
  indigo: 'bg-indigo-800',
};

export default function Dashboard() {
  const [newListTitle, setNewListTitle] = useState('');
  const [addingList, setAddingList] = useState(false);

  const { id: boardId } = useParams<{ id: string }>();
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    lists,
    board,
    addList,
    removeList,
    editList,
    editBoardTitle,
    addTask,
    removeTask,
    editTask,
    toggleComplete,
    onDragEnd,
  } = useBoardController(boardId!);

  // Cálculo de contadores
  const totalLists = lists.length;
  const totalTasks = lists.reduce((acc, list) => acc + list.tasks.length, 0);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    addList(newListTitle);
    setNewListTitle('');
    setAddingList(false);
  };

  const bgColor = board ? boardColors[board.color] || 'bg-blue-800' : 'bg-blue-800';

  return (
    <div className={`min-h-screen ${bgColor} text-white flex flex-col`}>
      <nav className="bg-black/20 backdrop-blur-sm p-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white text-sm font-semibold"
          >
            ← Inicio
          </button>
          <EditableText
            initialText={board?.title || 'Cargando...'}
            onEdit={(newTitle) => editBoardTitle(newTitle)}
            className="text-xl font-bold text-white hover:bg-white/20 px-2 py-1 rounded transition-colors"
          />
        </div>

        {/* Contadores de Listas y Tarjetas */}
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="font-bold text-white">{totalLists}</span>
            <span className="text-white/70">Listas</span>
          </div>
          <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="font-bold text-white">{totalTasks}</span>
            <span className="text-white/70">Tarjetas</span>
          </div>
        </div>

        <button
          onClick={() => {
            auth.logout();
            navigate('/login');
          }}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </nav>

      <div className="p-4 flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 items-start">
            {lists.map((list) => (
              <div
                key={list.id}
                className="w-72 bg-gray-100 rounded-lg shadow-lg flex flex-col max-h-[80vh]"
              >
                <div className="p-3 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <EditableText
                      initialText={list.title}
                      onEdit={(newTitle) => editList(list.id, newTitle)}
                      className="font-bold text-gray-800 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                    />
                    {/* Badge de conteo de tarjetas */}
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
                      {list.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => removeList(list.id)}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>

                <Droppable droppableId={list.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="px-2 flex-1 overflow-y-auto min-h-[100px]"
                    >
                      {list.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(prov) => (
                            <TaskItem
                              task={task}
                              innerRef={prov.innerRef}
                              draggableProps={prov.draggableProps}
                              dragHandleProps={prov.dragHandleProps}
                              onEdit={editTask}
                              onToggle={toggleComplete}
                              onDelete={(taskId: string) => removeTask(list.id, taskId)}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <AddCardForm onAdd={(title) => addTask(list.id, title)} />
              </div>
            ))}

            {/* Botón de añadir lista */}
            <div className="w-72 flex-shrink-0">
              {addingList ? (
                <form onSubmit={handleAddList} className="bg-gray-100 p-3 rounded shadow-lg">
                  <input
                    autoFocus
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Introduce el título de la lista..."
                    className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onClick={() => setAddingList(false)}
                      className="text-gray-600 hover:text-gray-900 px-2"
                    >
                      ✖
                    </button>
                  </div>
                </form>
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
      </div>
    </div>
  );
}

// Componente reutilizable para editar texto con un clic
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
          className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
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

// Componente de Tarjeta
function TaskItem({
  task,
  innerRef,
  draggableProps,
  dragHandleProps,
  onEdit,
  onToggle,
  onDelete,
}: {
  task: Task;
  innerRef: DraggableProvided['innerRef'];
  draggableProps: DraggableProvided['draggableProps'];
  dragHandleProps: DraggableProvided['dragHandleProps'];
  onEdit: (id: string, title: string) => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic arrastre la tarjeta
    setTitle(task.title);
    setIsEditing(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task.id, title);
    setIsEditing(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id, task.completed);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // El fix principal para poder eliminar la última tarjeta
    onDelete(task.id);
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="bg-white p-2 rounded shadow-sm mb-2 cursor-grab active:cursor-grabbing"
    >
      {isEditing ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-1 text-sm text-gray-800 bg-white border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-2 rounded text-xs">
            ✓
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={handleToggle}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-green-500'}`}
            >
              {task.completed && <span className="text-white text-xs">✓</span>}
            </button>

            <span
              className={`text-sm text-gray-800 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}
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
      )}
    </div>
  );
}

// Componente auxiliar para añadir tarjetas
function AddCardForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
      setAdding(false);
    }
  };

  // Nueva función para detectar la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Evita el salto de línea
      handleSubmit(e); // Envía el formulario
    }
  };

  if (adding) {
    return (
      <form onSubmit={handleSubmit} className="p-2">
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown} // <-- Agregado aquí
          placeholder="Introduce un título para esta tarjeta..."
          className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
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
            className="text-gray-600 hover:text-gray-900 px-2"
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
      className="text-gray-600 hover:bg-gray-200 w-full text-left py-2 px-3 text-sm rounded-b-lg transition-colors"
    >
      + Añade una tarjeta
    </button>
  );
}
