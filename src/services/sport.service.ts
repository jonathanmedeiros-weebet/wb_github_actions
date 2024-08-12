import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const tokenLiveSport = async (payload: {}) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas/token-aovivo`;
        
    return await axiosInstance().post(url,payload);
}

export const createBetSport = async (payload: {}) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas`;
    
    return await axiosInstance().post(url,payload);
}