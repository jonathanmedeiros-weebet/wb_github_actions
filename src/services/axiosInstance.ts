import { useConfigClient } from "@/stores";
import axios from "axios";

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
    (error: any) => Promise.reject(error)
  );

  return axiosInstance;
};

  