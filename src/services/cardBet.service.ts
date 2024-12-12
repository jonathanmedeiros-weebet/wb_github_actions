import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"


export const recharge = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${code}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};

export const create = async (bettorName: string, value: number, cardPin: string, confirmCardPin: string) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/create`;

    const payload = { apostador: bettorName, pin: cardPin, pin_confirmacao: confirmCardPin, valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
}