import { api } from '../api/axios'

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  refresh: async () => {
    const res = await api.post('/auth/refresh');
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
  me: async () => {
    const res = await api.get('/user/me');
    return res.data;
  },
}