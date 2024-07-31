import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";
import { localStorageService } from "@/services";

export const getCalculationValue = async (startDate: string, endDate: string) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/relatorios/resultado?data-inicial=${startDate}&data-final=${endDate}`;
    const response: any = await axiosInstance().get(url);
    return response.results;
}; 
