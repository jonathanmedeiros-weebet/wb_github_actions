import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"
import { localStorageService } from "@/services";

export const getMovements = async (startDate: string, endDate: string) => {
    const { apiUrl } =  useConfigClient();
    const url = `${apiUrl}/cambistas/listar-movimentacoes?periodoDe=${startDate}&periodoAte=${endDate}`;
    const token = localStorageService.get('token');
    const response: any =  await axiosInstance().get(url,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.results;
} 