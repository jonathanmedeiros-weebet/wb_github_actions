import { useConfigClient } from "@/stores";
import axios from "axios";
import { localStorageService } from "./storage.service";
import router from "@/router";

export const axiosInstance = () => {
  const { apiUrl } = useConfigClient();
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorageService.get('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: any) => response.data,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        localStorageService.removeAuth();
        router.push({ name: 'login' });
      }
      return Promise.reject({
        ...error.response.data,
        status: error.response.status
      })
    }
  );

  return axiosInstance;
};

  