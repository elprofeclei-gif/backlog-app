import API from '../api/axios';

export interface Task {
  id: string;
  title: string;
  completed: boolean; // <-- Nuevo
  listId: string;
}

export const TaskModel = {
  create: async (title: string, listId: string): Promise<Task> => {
    const { data } = await API.post('/tasks', { title, listId });
    return data;
  },
  update: async (
    id: string,
    data: { title?: string; completed?: boolean; listId?: string }
  ): Promise<Task> => {
    const { data: resData } = await API.put(`/tasks/${id}`, data);
    return resData;
  },
  delete: async (id: string): Promise<void> => {
    await API.delete(`/tasks/${id}`);
  },
};
