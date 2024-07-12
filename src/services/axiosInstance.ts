import axios from "axios";
import { localStorageService } from "./storage.service";
import VueRouter from 'vue-router';

export const axiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  axiosInstance.interceptors.response.use(
    (response: any) => response.data,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        //TODO: ADICIONAR TRATATIVA DE REDIRECIONAMENTO PARA TELA DE LOGIN
        console.log("--- Token inválido ---");
        localStorageService.removeAuth();
        return;
      }
      Promise.reject(error)
    }
  );

  return axiosInstance;
};

  