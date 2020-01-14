import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_ROOT } from '../configs/env-vars';

const httpService = (headers: {}): AxiosInstance => {
  const service = axios.create({
    baseURL: API_ROOT,
    headers,
    withCredentials: true,
  });
  service.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const errorResponse = error.response;
      if (process.env.NODE_ENV === 'production') {
        if (errorResponse?.status === 404) {
          window.location.pathname = '/not-found';
        }
        if (errorResponse?.status === 403) {
          window.location.pathname = '/not-permitted';
        }
      }
      if (errorResponse?.status === 401) {
        localStorage.clear();
        window.location.pathname = '/sign-in';
      }
      throw error;
    },
  );
  return service;
};

export default httpService;
