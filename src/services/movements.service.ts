import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getMovements = async (startDate: string, endDate: string) => {
    const { apiUrl } =  useConfigClient();
    const url = `${apiUrl}/cambistas/listar-movimentacoes?periodoDe=${startDate}&periodoAte=${endDate}`;
    const response: any =  await axiosInstance().get(url);
    return response.results;
} 