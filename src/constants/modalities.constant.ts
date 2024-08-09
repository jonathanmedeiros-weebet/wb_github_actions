import { Modalities } from "@/enums";
import type { ModalityOption } from "@/interfaces";
import { useConfigClient } from "@/stores";

export const modalityList = (): ModalityOption[] => {
    const { options } = useConfigClient();
    const modalities = [
        {
            name: 'Futebol',
            id: Modalities.SOCCER,
            show: true,
            hasLive: Boolean(options.futebol_aovivo),
        },
        {
            name: 'Combate',
            id: Modalities.COMBAT,
            show: Boolean(options.combate),
            hasLive: false,
        },
        {
            name: 'Futebol Americano',
            id: Modalities.AMERICAN_SOCCER,
            show: Boolean(options.futebol_americano),
            hasLive: false
        },
        {
            name: 'Tênis',
            id: Modalities.TENNIS,
            show: Boolean(options.tenis),
            hasLive: false
        },
        {
            name: 'Hóquei no Gelo',
            id: Modalities.HOCKEY,
            show: Boolean(options.hoquei_gelo),
            hasLive: false
        },
        {
            name: 'Basquete',
            id: Modalities.BACKETBALL,
            show: Boolean(options.basquete),
            hasLive: Boolean(options.basquete_aovivo)
        },
        {
            name: 'Futsal',
            id: Modalities.FUTSAL,
            show: Boolean(options.futsal),
            hasLive: false
        },
        {
            name: 'Volei',
            id: Modalities.VOLEIBALL,
            show: Boolean(options.volei),
            hasLive: false
        },
        {
            name: 'Tênis de Mesa',
            id: Modalities.TABLE_TENNIS,
            show: Boolean(options.tenis_mesa),
            hasLive: false
        },
        {
            name: 'e-Sports',
            id: Modalities.E_SPORT,
            show: Boolean(options.esports),
            hasLive: false
        },
        {
            name: 'Acumuladão',
            id: Modalities.ACCUMULATION,
            show: Boolean(options.acumuladao),
            hasLive: false
        },
        {
            name: 'Desafio',
            id: Modalities.CHALLENGE,
            show: Boolean(options.desafio),
            hasLive: false
        },
        {
            name: 'Loteria popular',
            id: Modalities.POPULAR_LOTTERY,
            show: Boolean(options.loteriaPopular),
            hasLive: false
        },
    ];

    return modalities.filter(modality => modality.show);
}

export const modalityOdds = () => {
    const { mainOdds } = useConfigClient();
    return {
        [Modalities.SOCCER]: mainOdds,
        [Modalities.AMERICAN_SOCCER]: ['futebol_americano_casa', 'futebol_americano_fora'],
        [Modalities.BACKETBALL]: ['bkt_casa', 'bkt_fora'],
        [Modalities.COMBAT]: ['cmbt_casa', 'cmbt_fora'],
        [Modalities.E_SPORT]: ['esports_casa', 'esports_fora'],
        [Modalities.FUTSAL]: ['futsal_casa', 'futsal_empate', 'futsal_fora'],
        [Modalities.HOCKEY]: ['hoquei_gelo_casa', 'hoquei_gelo_fora'],
        [Modalities.TABLE_TENNIS]: ['tenis_mesa_casa', 'tenis_mesa_fora'],
        [Modalities.TENNIS]: ['tenis_casa', 'tenis_fora'],
        [Modalities.VOLEIBALL]: ['volei_casa', 'volei_fora'],
        [Modalities.POPULAR_LOTTERY]: [],
        [Modalities.ACCUMULATION]: [],
        [Modalities.CHALLENGE]: [],
    }
}
