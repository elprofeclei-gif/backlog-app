import API from '../api/axios';
import type { Task } from './task.model';

export interface List {
  id: string;
  title: string;
  boardId: string;
  tasks: Task[];
}

export const ListModel = {
  getByBoard: async (boardId: string): Promise<List[]> => {
    const { data } = await API.get(`/lists/${boardId}`);
    return data;
  },
  create: async (title: string, boardId: string): Promise<List> => {
    const { data } = await API.post('/lists', { title, boardId });
    return data;
  },
  update: async (id: string, title: string): Promise<List> => {
    const { data } = await API.put(`/lists/${id}`, { title });
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await API.delete(`/lists/${id}`);
  },
};
