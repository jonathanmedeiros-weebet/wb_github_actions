import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";

export const getCalculationValue = async (startDate: string, endDate: string) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/financial/report?data-inicial=${startDate}&data-final=${endDate}`;
    const response: any = await axiosInstance().get(url);
    return response.results;
}; 
