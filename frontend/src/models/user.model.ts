import API from '../api/axios';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
}

export const UserModel = {
  getMe: async (): Promise<User> => {
    const { data } = await API.get('/users/me');
    return data;
  },
  updateMe: async (name: string): Promise<User> => {
    const { data } = await API.put('/users/me', { name });
    return data;
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await API.put('/users/password', { currentPassword, newPassword });
  },
  // Nueva función para subir imagen
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await API.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
