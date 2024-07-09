import axios from "axios";

export const axiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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

  