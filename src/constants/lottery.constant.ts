import { LotteryTypes } from "@/enums/lottery.enum";
import { useConfigClient } from "@/stores";

export const lotteryTypeList = () => {
    const { options } = useConfigClient();
    const { seninha_ativa, seninha_nome, quininha_ativa, quininha_nome } = options;

    const lotteries = [
        {
            name: seninha_nome,
            id: LotteryTypes.SENINHA,
            show: seninha_ativa,
        },
        {
            name: quininha_nome,
            id: LotteryTypes.QUININHA,
            show: quininha_ativa,
        },
    ];

    return lotteries.filter(lottery => lottery.show);
}