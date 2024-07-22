import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"
import { modalityOdds } from "@/constants";
import { QuotaStatus, type Modalities } from "@/enums";

interface CalculateQuotaParams {
    key: string;
    value: number;
    gameEventId: string | number;
    favorite: string;
    isLive: boolean;
}

export const getChampionship = async (championshipId: string = '', startDate: string = '') => {
    const { deadlineTable, mainOdds, centerUrl } = useConfigClient();
    const params = {
        data_final: deadlineTable,
        data: startDate,
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
        campeonatos_bloqueados: Boolean(blockedChampionships[`sport_${sportId}`]) ? blockedChampionships[`sport_${sportId}`].join(',') : '',
        data: startDate,
        data_final: deadlineTable,
        odds: getOddsBySportId(sportId).join(','),
        regiao_nome: regionName ?? '',
        ligas_populares: popularLeagueIds
    }
    const url = `${centerUrl}/campeonatos`;
    const response: any = await axiosInstance().get(url , {params})
    return response.result;
}

export const getLiveChampionship = async (sportId: number | string) => {
    try {
        const { centerUrl, liveChampionships } = useConfigClient();
        const url = `${centerUrl}/jogos/ao-vivo`;
        const response: any = await axiosInstance().get(url)
        return response.result.filter((championship: any) => championship.sport_id == sportId && liveChampionships.includes(championship._id))
    } catch {
        return [];
    }
}

const getOddsBySportId = (sportId: string | number) =>{
    const sportOdds = modalityOdds();
    return sportOdds[sportId as Modalities] ?? []
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
    const response: any = await axiosInstance().get(url);
    return response.result;
}

export const hasQuotaPermission = (quotaValue: number | string) => {
    const { options } = useConfigClient();
    return Number(quotaValue) >= Number(options.bloquear_cotacao_menor_que || 1.05);
}

export const calculateQuota = ({
    value = 0,
    key,
    gameEventId,
    favorite,
    isLive = false
}: CalculateQuotaParams) => {
    const FAVORITE_QUOTE_HOME = 'casa'
    const FAVORITE_QUOTE_OUTSIDE = 'fora'
    const { betOptions, localQuotes, options } = useConfigClient();
    const betType = betOptions[key] ?? undefined;

    if (localQuotes[gameEventId] && localQuotes[gameEventId][key]) {
        value = parseFloat(localQuotes[gameEventId][key].valor);
    }

    if (Boolean(betType)) {
        if (isLive) {
            const liveFactor = Boolean(betType.fator_ao_vivo)
                ? parseFloat(betType.fator_ao_vivo)
                : 1;

            value = value * liveFactor;
        } else {
            const factor = Boolean(betType.fator)
                ? parseFloat(betType.fator)
                : 1;

            value = value * factor;

            if (Boolean(favorite)) {
                const favoriteZebraQuotes = [
                    'casa_90',
                    'fora_90',
                    'casa_empate_90',
                    'fora_empate_90'
                ];

                if (favoriteZebraQuotes.includes(key)) {
                    if (/casa/.test(key)) {
                        value *= (favorite === FAVORITE_QUOTE_HOME)? options.fator_favorito : options.fator_zebra;
                    } else {
                        value *= (favorite === FAVORITE_QUOTE_OUTSIDE) ? options.fator_favorito : options.fator_zebra;
                    }
                }
            }
        }

        if (value > betType.limite) {
            value = parseFloat(betType.limite);
        }
    }

    return value.toFixed(2);
}

export const prepareLiveQuote = (lastQuotes: any[], newQuotes: any[]) => {
    return newQuotes.map(newQuote => {
        let lastQuote = lastQuotes.find(quote => quote.chave == newQuote.chave);
        lastQuote = lastQuote ?? newQuote;
        
        let status = QuotaStatus.DEFAULT;
        if(newQuote.valor != lastQuote.valor) {
          status = newQuote.valor > lastQuote.valor ? QuotaStatus.INCREASED: QuotaStatus.DECREASED;
        }

        return {
          ...lastQuote,
          ...newQuote,
          valor: newQuote.valor,
          valor_anterior: lastQuote.valor,
          status,
        }
    })
}
