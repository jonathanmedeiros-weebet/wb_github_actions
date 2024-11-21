import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getPreBetByCode = async ( code: string) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/pre-bets/${code}`;
   
    return await axiosInstance().get(url);
}