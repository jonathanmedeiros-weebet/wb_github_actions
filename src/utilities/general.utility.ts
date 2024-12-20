import { useConfigClient } from "@/stores";

declare var WeebetMessage: any;

export const delay = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time);
    })
}

export const removerAcentos = (stringToSanitize: string) => {
    return stringToSanitize.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const wbPostMessage = (
    action: string = '',
    data: any = null,
    message: string = '',
    file: any = null
) => {
    WeebetMessage.postMessage(JSON.stringify({
        action,
        data,
        message,
        file
    }));
}

export const getAndroidVersion = () => {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/Android\s([0-9\.]*)/);
    
    return match ? match[1] : false;
}

export const isAndroid5 = () => {
    const androidVersion = getAndroidVersion();
    if (!androidVersion) return false;
    const version = parseInt(androidVersion.split('.')[0], 10);
    return version <= 5;
}

export const capitalizeFirstLetter = (str: string) => {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }else{
        return str;
    }
}

export const calculateTotalValueLottery = (bet: any) => {
    return bet.itens.reduce((total: any, i: any) => {
        return total + i.valor;
    }, 0);
}

export const calculateLotteryWinnings = (valor: any, cotacao: any) => {
    const { maxLotteryValue } = useConfigClient();

    let result = valor * cotacao;

    if (result > maxLotteryValue) {
        result = maxLotteryValue;
    }

    return result;
}

export const calculateNetLotteryWinnings = (valor: any, cotacao: any, percentualPremio: any) => {
    const { maxLotteryValue } = useConfigClient();

    let result = valor * cotacao;

    if (result > maxLotteryValue) {
        result = maxLotteryValue;
    }

    result = result * (100 - percentualPremio) / 100;

    return result;
}

export const getNameModalityLottery = (modalidade:any) => {
    const { getSenaName, getQuinaName } = useConfigClient();

    if (modalidade === 'seninha') {
        return getSenaName;
    } else {
        return getQuinaName;
    }
}

export const getOddAcronym = (key:any) => {
    const { betOptions } = useConfigClient();

    if (key) {
        const betsOption = betOptions;
        const sigla = `${betsOption[key].sigla}     `;
        return sigla.substr(0, 5);
    }
    return '    ';
}

export const getOddValue = (key: any, odds: any) => {
    const odd = odds.find((k: { chave: any; }) => k.chave == key);
    if (odd) {
        let res = odd.valor.toFixed(2);
        if (odd.valor < 10) {
            res = `${res} `;
        }
        return res;
    }
    return '     ';
}

export const getOddsToPrint = async() => {
    const { betOptions } = useConfigClient();
    const betTypes = betOptions;

    const printOdds = [];
    for (const key in betTypes) {
        if (betTypes.hasOwnProperty(key)) {
            const betType = betTypes[key];
            if (parseInt(betType.exibirImpressao, 10)) {
                printOdds.push(key);
            }
        }
    }
    
    return printOdds;
}