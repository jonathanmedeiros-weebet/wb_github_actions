import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const getChampionship = async (championshipId: string = '') => {
    const { deadlineTable, mainOdds, centerUrl } = useConfigClient();
    const params = {
        data_final: deadlineTable,
        odds: mainOdds.join(','),
    }
    const url = `${centerUrl}/campeonatos/${championshipId}`;
    return await axiosInstance().get(url, {params})
}

export const getChampionshipBySportId = async (
    sportId: string = '',
    regionName: string = '',
    startDate: string = '',
    isPopularLeagues: boolean = false
) => {
    const {
        blockedChampionships,
        deadlineTable,
        mainOdds,
        centerUrl,
        popularLeagues
    } = useConfigClient();

    const popularLeagueIds = isPopularLeagues
        ? popularLeagues
            .filter((game: any) => game.sport_id == sportId)
            .map((game: any) => game.api_id)
            .join(',')
        : '';

    const params = {
        sport_id: sportId,
        campeonatos_bloqueados: Boolean(blockedChampionships[sportId]) ? blockedChampionships[sportId].join(',') : '',
        data: startDate,
        data_final: !Boolean(startDate) ? deadlineTable : '',
        odds: mainOdds.join(','),
        regiao_nome: regionName ?? '',
        ligas_populares: popularLeagueIds
    }
    const url = `${centerUrl}/campeonatos`;
    return await axiosInstance().get(url , {params})
}

export const getChampionshipRegionBySportId = async (sportId: string) => {
    const { blockedChampionships, deadlineTable, centerUrl } = useConfigClient();
    const params = {
        sport_id: sportId,
        campeonatos_bloqueados: Boolean(blockedChampionships[sportId]) ? blockedChampionships[sportId].join(',') : '',
        data_final: deadlineTable
    }
    const url = `${centerUrl}/campeonatos/regioes`;
    return await axiosInstance().get(url , {params})
}

export const getGame = async (gameId: string) => {
    const { centerUrl } = useConfigClient();
    const url = `${centerUrl}/jogos/${gameId}`;
    return await axiosInstance().get(url)
}
