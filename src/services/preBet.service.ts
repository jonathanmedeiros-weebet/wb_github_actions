import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getPreBetByCode = async ( code: string) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/preapostas/${code}`;
   
    return await axiosInstance().get(url);
}