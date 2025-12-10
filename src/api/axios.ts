import axios, { AxiosHeaders } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

interface InterceptorOptions {
  getAccessToken: () => string | null,
  setAccessToken: (token: string) => void,
  logout: () => void,
}

export function attachInterceptors({ getAccessToken, setAccessToken, logout }: InterceptorOptions){
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  })


  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (!original) return Promise.reject(error);

      if (error.response?.status === 401){
        logout();
      }
      return Promise.reject(error);
    }
  );
}