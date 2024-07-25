import { useConfigClient } from "@/stores"
import { axiosInstance } from "./axiosInstance";

export const createPrebet = async(payload: any) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas`
    return await axiosInstance().post(url, payload);
}

export const createLiveToken = async(payload: any) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas/token-aovivo`
    const response: any = await axiosInstance().post(url, payload);
    return response.results;
}
