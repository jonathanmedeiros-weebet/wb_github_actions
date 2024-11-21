
import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance";

export const getGameUrlPopularLottery = async () => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/lottery/bets/url`;

    return await axiosInstance().get(url);
};