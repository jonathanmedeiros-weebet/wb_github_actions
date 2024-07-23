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

  axiosInstance.interceptors.response.use(
    (response: any) => response.data,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        localStorageService.removeAuth();
        router.push({ name: 'login' });
        return;
      }
      return Promise.reject(error)
    }
  );

  return axiosInstance;
};

  