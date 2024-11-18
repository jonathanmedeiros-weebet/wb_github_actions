import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getCashFlow = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/cash-flow`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

export const getFinancial = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/position`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

export const listMovements = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/movements`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    return await axiosInstance().get(fullUrl);
}

