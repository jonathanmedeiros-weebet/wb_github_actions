import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";

export const getResults = async (date: string, id: string) => {
    const { centerUrl } = useConfigClient();
    const url = `${centerUrl}/resultados?data=${date}&sport_id=${id}`;
    const response: any = await axiosInstance().get(url);
    return response.result; 
};
