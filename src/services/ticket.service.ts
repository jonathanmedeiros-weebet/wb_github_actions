import { useConfigClient } from "@/stores"
import { axiosInstance } from "./axiosInstance";

export const createPrebet = async(payload: any) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/preapostas/esportes`
    return await axiosInstance().post(url, payload);
}