import { useConfigClient, useTicketStore } from "@/stores";
import { axiosInstance } from "./axiosInstance";

export const findLotteryBets = async (parameters: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/lottery/bets`;

    const params = new URLSearchParams();

    params.append('codigo', parameters.codigo);
    params.append('data-inicial', parameters.dataInicial);
    params.append('data-final', parameters.dataFinal);
    params.append('status', parameters.status);
    params.append('apostador', parameters.apostador);
    params.append('sort', parameters.sort);

    const response: any = await axiosInstance().get(url, { params });
    
    return response.results;
}

export const createLotteryBet = async (data: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/lottery/bets`;

    data = {
        ...data,
        ibge_code: null,
        locale_state: null
    }

    const response: any = await axiosInstance().post(url, data);
    return response.results;
}

export const getLotteryBetsByType = async (parameters: any) => {
    //paramsEx = tipo:seninha sort:sort
    const { lokiUrl } = useConfigClient();
    let url = `${lokiUrl}/lottery/bets/type`;
    let params = new URLSearchParams();

    if (parameters) {
        parameters?.type ? params.append('tipo', parameters.type) : '';
        parameters?.sort ? params.append('sort', parameters.sort) : '';
    }

    const response: any = await axiosInstance().get(url, { params });

    return response.results;
}

export const getLotteryDraw = async (parameters: any) => {
    //paramsEx = tipo:seninha, sort: data
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/lottery/bets/draw`;

    const params = new URLSearchParams();

    if (parameters) {
        parameters.type ? params.append('tipo', parameters.type) : '';
    }
 
    const response: any = await axiosInstance().get(url, { params });

    return response.results;
}

export const copyLotteryBets = async (code: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/lottery/bets/copy/${code}`;
    
    const response: any = await axiosInstance().get(url);

    return response.results;
}
