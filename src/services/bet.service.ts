import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getByCode = async ( code: string ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas-por-codigo/${code}`;
    
    return await axiosInstance().get(url);        
}

export const getById = async ( id: number ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas/${id}`;
    
    return await axiosInstance().get(url);        
}

export const find = async ( parametros: any ) => {

    const { apiUrl } = useConfigClient();
    let url = `${apiUrl}/esportes/apostas`;
    
    const params = new URLSearchParams();

    params.append('codigo', parametros.codigo);
    params.append('data-inicial', parametros.dataInicial);
    params.append('data-final', parametros.dataFinal);
    params.append('status', parametros.status);
    params.append('apostador', parametros.apostador);
    params.append('sort', parametros.sort);
    params.append('otimizado', parametros.otimizado);

    // Adiciona os parâmetros à URL se existirem
    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    
    return await axiosInstance().get(url);        
}

export const cancelBet = async ( bet: any ) => {
    const { centerUrl } = useConfigClient();
    const url = `${centerUrl}/apostas/${bet.id}/cancelar`;

    const payload = {
        version: bet.version
    }
    
    return await axiosInstance().post(url, payload);
}

export const payBet = async ( id: number ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas/${id}/pagamento`;
        
    return await axiosInstance().post(url, {});
}

export const simulateBetClosure = async ( id: number ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/apostas/simular-encerramento?aposta=${id}`;
        
    return await axiosInstance().get(url);
}

export const tokenLiveClosing = async (id: any) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/esportes/apostas/token-aovivo-encerramento`;
        
    return await axiosInstance().post(url, { aposta: id });
}

export const closeBet = async (payload: any) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/apostas/encerrar-aposta`;
        
    return await axiosInstance().post(url, payload);
}