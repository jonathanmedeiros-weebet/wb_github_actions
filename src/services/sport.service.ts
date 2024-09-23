import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const createBetSport = async (payload: {}) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas`;
    
    return await axiosInstance().post(url,payload);
}