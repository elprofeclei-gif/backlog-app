import API from '../api/axios';

export interface Board {
  id: string;
  title: string;
  color: string;
  _count?: { tasks: number };
  lists?: { _count: { tasks: number } }[]; // <-- Nuevo
}

export const BoardModel = {
  getAll: async (): Promise<Board[]> => {
    const { data } = await API.get('/boards');
    return data;
  },
  getById: async (id: string): Promise<Board> => {
    const { data } = await API.get(`/boards/${id}`);
    return data;
  },
  create: async (title: string, color: string): Promise<Board> => {
    const { data } = await API.post('/boards', { title, color });
    return data;
  },
  update: async (id: string, title: string): Promise<Board> => {
    const { data } = await API.put(`/boards/${id}`, { title });
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await API.delete(`/boards/${id}`);
  },
};
