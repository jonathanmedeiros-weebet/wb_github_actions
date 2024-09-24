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