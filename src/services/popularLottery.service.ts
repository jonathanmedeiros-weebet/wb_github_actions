
import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";

export const getGameUrlPopularLottery = async () => {
    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/loteria/loteria-popular/url`;

    return await axiosInstance().get(url);
};