import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getBetByCode = async ( code: string ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/bets/code/${code}`;
    
    return await axiosInstance().get(url);        
}

export const getBetById = async ( id: number, params = {}) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/bets/${id}`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);        
}

export const findBet = async ( parametros: any ) => {

    const { lokiUrl } = useConfigClient();
    let url = `${lokiUrl}/sport/bets`;
    
    const params = new URLSearchParams();

    params.append('codigo', parametros.codigo);
    params.append('data-inicial', parametros.dataInicial);
    params.append('data-final', parametros.dataFinal);
    params.append('status', parametros.status);
    params.append('apostador', parametros.apostador);
    params.append('sort', parametros.sort);
    

    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    return await axiosInstance().get(url);        
}

export const cancelBet = async ( bet: any ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/bets/${bet.id}/cancel`;

    const payload = {
        version: bet.version
    }
    
    return await axiosInstance().post(url, payload);
}

export const payBet = async ( id: number ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/bets/${id}/pay`;
        
    return await axiosInstance().post(url, {});
}

export const simulateBetClosure = async ( id: number ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/sport/bets/${id}/close-simulate`;
        
    return await axiosInstance().get(url);
}

export const tokenLiveClosing = async (id: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/sport/bets/live-token-close`;
        
    return await axiosInstance().post(url, { aposta: id });
}

export const closeBet = async (payload: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/sport/bets/close`;
        
    return await axiosInstance().post(url, payload);
}

export const createBetSport = async (payload: {}) => {
    payload = {
        ...payload,
        ibge_code: null,
        locale_state: null
    }
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/sport/bets`;
    const response: any = await axiosInstance().post(url, payload);
    return response.results;
}