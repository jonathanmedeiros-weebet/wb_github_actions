import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";
import { localStorageService } from "@/services";

export const getCalculationValue = async () => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/relatorios/resultado?data-inicial=2024-07-22&data-final=2024-07-28`;
    const token = localStorageService.get('token');
    const response: any = await axiosInstance().get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.results;
};
