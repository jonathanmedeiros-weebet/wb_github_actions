import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"


export const reloading = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/recharge/${code}`;

    const payload = { valor: value };

    const response = await axiosInstance().post(url, payload);
    return response.data; 
};