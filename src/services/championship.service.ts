import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export interface ChampionShipParam {
    sportId: number;
    championshipBlockeds: string[];
    popularLeagues: string[];
    odds: string[];
    date: string;
}

export const getChampionShipBySportId = async (sportId: string) => {
    const { blockedChampionships, deadlineTable, mainOdds, centerUrl } = useConfigClient();
    const params = {
        sport_id: sportId,
        campeonatos_bloqueados: Boolean(blockedChampionships[sportId]) ? blockedChampionships[sportId].join(',') : '',
        data_final: deadlineTable,
        odds: mainOdds.join(',')
    }
    const url = `${centerUrl}/campeonatos`;
    return await axiosInstance().get(url , {params})
}

export const getChampionShipRegionBySportId = async (sportId: string) => {
    const { blockedChampionships, deadlineTable, centerUrl } = useConfigClient();
    const params = {
        sport_id: sportId,
        campeonatos_bloqueados: Boolean(blockedChampionships[sportId]) ? blockedChampionships[sportId].join(',') : '',
        data_final: deadlineTable
    }
    const url = `${centerUrl}/campeonatos/regioes`;
    return await axiosInstance().get(url , {params})
}
