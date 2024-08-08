import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getCashFlow = async ( params = {} ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/cambistas/fluxoCaixa`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}


export const getFinancial = async ( params = {} ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/cambistas/financeiro`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

export const getQtdBets = async ( params = {} ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/cambistas/quantidadeApostas`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

export const listMovements = async ( params = {} ) => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/cambistas/listar-movimentacoes`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

