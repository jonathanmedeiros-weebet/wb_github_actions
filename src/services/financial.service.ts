import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getCashFlow = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/cash-flow`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const response: any = await axiosInstance().get(fullUrl);
    return response.results
}

export const getFinancial = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/position`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const response: any = await axiosInstance().get(fullUrl);
    const { bonus, ...filteredResults } = response.results;
    return filteredResults;
}

export const listMovements = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/movements`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const response: any = await axiosInstance().get(fullUrl);
    return response.results;
}

export const detailedReport = async ( params = {} ) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/detailed-report`;
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    const response: any = await axiosInstance().get(fullUrl);
    return response;
}

