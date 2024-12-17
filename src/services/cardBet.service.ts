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

export const consultCard = async (chave: any, pin: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${chave}/consult`;

    const response: any = await axiosInstance().get(url, {
        params: { pin },
    });
    return response.results;
};

export const findCardBet = async ( params: any) => {

    const { lokiUrl } = useConfigClient();
    let url = `${lokiUrl}/card-bets`;

    const urlParams = new URLSearchParams();

    urlParams.append('apostador', params.gambler);
    urlParams.append('data-inicial', params.initialDate);
    urlParams.append('data-final', params.finalDate);
    urlParams.append('sort', params.sort);

    url += `?${urlParams.toString()}`;

    const response: any = await axiosInstance().get(url);
    return response.results;
}

export const create = async (payload: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets`;
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

export const withdrawalPayment = async (id: any, version: any) => {
    const { lokiUrl } = useConfigClient();

    const url = `${lokiUrl}/card-bets/${id}/request-withdrawal`;
    const payload = { id: id, version: version };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
}

export const sharedCard = async (chave: any, pin: any) => {
    const { slug, options } = useConfigClient();

    const url = `https://${slug}/create-receipt/${chave}/${pin}`;

    let message = `\r${options.banca_nome} \n\nSeu Cartão: \n${url} \n`;

    wbPostMessage('shareURL', url, message);
}
