import { ModalitiesBetsApi, ModalitiesLSport } from "@/enums";
import type { ModalityOption } from "@/interfaces";
import { useConfigClient } from "@/stores";

export const getModalitiesEnum = () => {
    const { sportbook } = useConfigClient();

    switch (sportbook) {
        case 'betsapi':
            return ModalitiesBetsApi;
        case 'lsport':
            return ModalitiesLSport;
        default:
            return ModalitiesBetsApi;
    }
}

export const modalityList = (): ModalityOption[] => {
    const { options, popularLotteryDeprecatedByAndroidVersion } = useConfigClient();
    const Modalities = getModalitiesEnum();
    const modalities = [
        {
            name: 'Futebol',
            id: Modalities.FOOTBALL,
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
            id: Modalities.AMERICAN_FOOTBALL,
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
            id: Modalities.ICE_HOCKEY,
            show: Boolean(options.hoquei_gelo),
            hasLive: false
        },
        {
            name: 'Basquete',
            id: Modalities.BASKETBALL,
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
            name: 'Vôlei',
            id: Modalities.VOLLEYBALL,
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
            id: Modalities.E_SPORTS,
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
            name: 'Loteria Popular',
            id: Modalities.POPULAR_LOTTERY,
            show: Boolean(options.loteriaPopular) && !popularLotteryDeprecatedByAndroidVersion,
            hasLive: false
        },
        {
            name: 'Loteria',
            id: Modalities.LOTTERY,
            show: Boolean(options.loterias),
            hasLive: false
        }
    ];

    return modalities.filter(modality => modality.show);
}

export const modalityOdds = () => {
    const { mainOdds } = useConfigClient();
    const Modalities = getModalitiesEnum();
    
    return {
        [Modalities.FOOTBALL]: mainOdds,
        [Modalities.AMERICAN_FOOTBALL]: ['futebol_americano_casa', 'futebol_americano_fora'],
        [Modalities.BASKETBALL]: ['bkt_casa', 'bkt_fora'],
        [Modalities.COMBAT]: ['cmbt_casa', 'cmbt_fora'],
        [Modalities.E_SPORTS]: ['esports_casa', 'esports_fora'],
        [Modalities.FUTSAL]: ['futsal_casa', 'futsal_empate', 'futsal_fora'],
        [Modalities.ICE_HOCKEY]: ['hoquei_gelo_casa', 'hoquei_gelo_fora'],
        [Modalities.TABLE_TENNIS]: ['tenis_mesa_casa', 'tenis_mesa_fora'],
        [Modalities.TENNIS]: ['tenis_casa', 'tenis_fora'],
        [Modalities.VOLLEYBALL]: ['volei_casa', 'volei_fora'],
        [Modalities.POPULAR_LOTTERY]: [],
        [Modalities.ACCUMULATION]: [],
        [Modalities.CHALLENGE]: [],
    }
}

export const modalitiesBetList = () => {
    const { lotteryEnabled, sportEnabled } = useConfigClient();

    const Modalities = [
        {
            name: 'Esporte',
            id: 1,
            active: sportEnabled
        },
        {
            name: 'Loteria',
            id: 2,
            active: lotteryEnabled
        }
    ]

    return Modalities.filter(modality => modality.active);
}