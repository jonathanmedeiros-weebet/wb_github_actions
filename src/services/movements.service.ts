import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"
import { localStorageService } from "@/services";

export const getBalance = async () => {
    const { apiUrl } =  useConfigClient();
    const url = `${apiUrl}/cambistas/listar-movimentacoes?periodoDe=2024-07-29&periodoAte=2024-08-04`;
    const token = localStorageService.get('token');
    const response: any =  await axiosInstance().get(url,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.results;
} 