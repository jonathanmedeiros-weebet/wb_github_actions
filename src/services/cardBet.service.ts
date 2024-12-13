import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"
import { wbPostMessage } from "@/utilities";

export const recharge = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${code}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};

export const create = async (bettorName: string, value: number, cardPin: string, confirmCardPin: string) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/`;

    const payload = { apostador: bettorName, pin: cardPin, pin_confirmacao: confirmCardPin, valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
}

export const consultCard = async (chave: any, pin: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${chave}/consult`;
    const response: any = await axiosInstance().get(url, {
        params: { pin },
    });
    return response.results ?? response.data.results;
};

export const sharedCard = async (chave: any, pin: any) => {
    const { slug, options } = useConfigClient();

    const url = `https://${slug}/create-receipt/${chave}/${pin}`;

    let message = `\r${options.banca_nome} \n\nSeu Cartão: \n${url} \n`;

    wbPostMessage('shareURL', url, message);
}