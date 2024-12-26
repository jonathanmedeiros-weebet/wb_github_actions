import { useConfigClient } from "@/stores"
import { axiosInstance } from "./axiosInstance";
import { wbPostMessage } from "@/utilities";

export const createLiveToken = async(payload: any) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/sport/bets/live-token`
    const response: any = await axiosInstance().post(url, payload);
    return response.results;
}

export const sharedTicket = (aposta: any, file: any = null) => {
    const { clientCenterUrl, slug, options } = useConfigClient();

    const url = (aposta.tipo === 'loteria')
        ? `${clientCenterUrl}/aposta/${aposta.codigo}`
        : `https://${slug}/bilhete/${aposta.codigo}`;

    let message = `\r${options.banca_nome} \n\nSeu Bilhete: \n${url} \n`;
    if (Boolean(options.casa_das_apostas_id)) {
        message += `\nCasa das Apostas: \nhttp://casadasapostas.net/bilhete?banca=${options.casa_das_apostas_id}&codigo=${aposta.codigo}`;
    }

    wbPostMessage('shareURL', url, message, file)
}

export const getLogoTicket = async () => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/ticket-logo`
    const response: any = await axiosInstance().get(url);
    return response.results;
}