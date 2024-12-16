import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"


export const recharge = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${code}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};

export const requestWithdrawal = async (params: any) => {
    const { lokiUrl } = useConfigClient();
    let url = `${lokiUrl}/card-bets/withdrawals`;

    const urlParams = new URLSearchParams();

    urlParams.append('data-inicial', params.initialDate);
    urlParams.append('data-final', params.endDate);
    urlParams.append('aprovado', params.status);

    url += `?${urlParams.toString()}`;

    const response: any = await axiosInstance().get(url);
    return response.results;
};