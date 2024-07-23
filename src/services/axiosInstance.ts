import { useConfigClient } from "@/stores";
import axios from "axios";
import { localStorageService } from "./storage.service";
import VueRouter from 'vue-router';

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
        //TODO: ADICIONAR TRATATIVA DE REDIRECIONAMENTO PARA TELA DE LOGIN
        console.warn("--- Token inválido ---");
        localStorageService.removeAuth();
        return;
      }
      return Promise.reject(error)
    }
  );

  return axiosInstance;
};

  