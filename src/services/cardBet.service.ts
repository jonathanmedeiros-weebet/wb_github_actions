import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"


export const recharge = async (code: any, value: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/card-bets/${code}/recharge`;

    const payload = { valor: value };

    const response: any = await axiosInstance().post(url, payload);
    return response.results; 
};

export const FindCardBet = async ( parametros: any) => {

    const { lokiUrl } = useConfigClient();
    let url = `${lokiUrl}/card-bets`;

    const params = new URLSearchParams();

    params.append('apostador', parametros.apostador);
    params.append('data-inicial', parametros.dataInicial);
    params.append('data-final', parametros.dataFinal);
    params.append('sort', parametros.sort);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    return await axiosInstance().get(url); 
}