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
  refreshToken: () => Promise<{ accessToken: string; expiresIn: string }>;
}

export function attachInterceptors({ getAccessToken, setAccessToken, logout, refreshToken }: InterceptorOptions){
  let isRefreshing = false;
  let refreshQueue: ((token: string) => void)[] = [];

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

      if (error.response.status === 401 && !original._retry) {
        original._retry = true;
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const data = await refreshToken();
            setAccessToken(data.accessToken);

            refreshQueue.forEach((cb) => cb(data.accessToken));
            refreshQueue = [];
            return api(original);
          } catch {
            logout();
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve, reject) => {
            refreshQueue.push((token: string) => {
              if (!original.headers) original.headers = new AxiosHeaders();
              original.headers.set("Authorization", `Bearer ${token}`);
              resolve(api(original));
            });
          });
        }
      }
      return Promise.reject(error);
    }
  );
}