import { useState, useEffect } from 'react';
import { ListModel } from '../models/list.model';
import type { List } from '../models/list.model';
import { TaskModel } from '../models/task.model';
import { BoardModel } from '../models/board.model';
import type { Board } from '../models/board.model';
import type { DropResult } from '@hello-pangea/dnd';

export const useBoardController = (boardId: string) => {
  const [lists, setLists] = useState<List[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsData, boardData] = await Promise.all([
          ListModel.getByBoard(boardId),
          BoardModel.getById(boardId),
        ]);
        setLists(listsData);
        setBoard(boardData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [boardId]);

  const addList = async (title: string) => {
    if (!title.trim()) return;
    try {
      const newList = await ListModel.create(title, boardId);
      setLists((prev) => [...prev, { ...newList, tasks: [] }]);
    } catch (error) {
      console.error(error);
    }
  };

  const removeList = async (id: string) => {
    try {
      await ListModel.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const editList = async (listId: string, newTitle: string) => {
    try {
      await ListModel.update(listId, newTitle);
      setLists((prev) =>
        prev.map((list) => (list.id === listId ? { ...list, title: newTitle } : list))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const editBoardTitle = async (newTitle: string) => {
    if (!board) return;
    try {
      await BoardModel.update(board.id, newTitle);
      setBoard((prev) => (prev ? { ...prev, title: newTitle } : prev));
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (listId: string, title: string) => {
    if (!title.trim()) return;
    try {
      const newTask = await TaskModel.create(title, listId);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeTask = async (listId: string, taskId: string) => {
    try {
      await TaskModel.delete(taskId);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) } : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const editTask = async (taskId: string, newTitle: string) => {
    try {
      await TaskModel.update(taskId, { title: newTitle });
      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          tasks: list.tasks.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t)),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await TaskModel.update(taskId, { completed: !completed });
      setLists((prev) =>
        prev.map((list) => ({
          ...list,
          tasks: list.tasks.map((t) => (t.id === taskId ? { ...t, completed: !completed } : t)),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const sourceList = lists.find((l) => l.id === source.droppableId);
    const destList = lists.find((l) => l.id === destination.droppableId);
    if (!sourceList || !destList) return;

    const task = sourceList.tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Actualizar estado local (Optimistic UI) corregido para misma lista
    setLists((prev) => {
      const newLists = prev.map((list) => {
        if (list.id === source.droppableId) {
          const newTasks = list.tasks.filter((t) => t.id !== draggableId);
          // Si es la misma lista, insertar en la nueva posición aquí mismo
          if (source.droppableId === destination.droppableId) {
            newTasks.splice(destination.index, 0, task);
          }
          return { ...list, tasks: newTasks };
        }
        // Si es otra lista, insertar en la lista destino
        if (list.id === destination.droppableId) {
          const newTasks = [...list.tasks];
          newTasks.splice(destination.index, 0, task);
          return { ...list, tasks: newTasks };
        }
        return list;
      });
      return newLists;
    });

    // Actualizar backend
    try {
      // Solo llamamos a la API si cambió de lista (nuestro backend aún no maneja orden internamente)
      if (source.droppableId !== destination.droppableId) {
        await TaskModel.update(draggableId, { listId: destination.droppableId });
      }
    } catch (error) {
      console.error('Error al mover tarea', error);
    }
  };

  return {
    lists,
    board,
    loading,
    addList,
    removeList,
    editList,
    editBoardTitle,
    addTask,
    removeTask,
    editTask,
    toggleComplete,
    onDragEnd,
  };
};
