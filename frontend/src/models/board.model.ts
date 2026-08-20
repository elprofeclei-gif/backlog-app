import API from '../api/axios';

export interface Board {
  id: string;
  title: string;
  color: string;
  _count?: { tasks: number };
  lists?: { _count: { tasks: number } }[];
  order?: number;
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
  // Actualizamos para recibir un objeto con título y/o color
  update: async (id: string, data: { title?: string; color?: string }): Promise<Board> => {
    const { data: resData } = await API.put(`/boards/${id}`, data);
    return resData;
  },
  delete: async (id: string): Promise<void> => {
    await API.delete(`/boards/${id}`);
  },
  reorder: async (boards: { id: string; order: number }[]): Promise<void> => {
    await API.put('/boards/reorder', { boards });
  },
};
