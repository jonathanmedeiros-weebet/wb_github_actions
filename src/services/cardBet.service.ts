import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"


export const recharge = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${code}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};

export const requestWithdrawal = async (status: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${status}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};