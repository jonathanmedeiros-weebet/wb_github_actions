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
    const { apiUrl, slug, options } = useConfigClient();
    const host = apiUrl.replace('api/', '');

    const url = (aposta.tipo === 'loteria')
        ? `${host}/aposta/${aposta.codigo}`
        : `https://${slug}/bilhete/${aposta.codigo}`;

    let message = `\r${options.banca_nome} \n\nSeu Bilhete: \n${url} \n`;
    if (Boolean(options.casa_das_apostas_id)) {
        message += `\nCasa das Apostas: \nhttp://casadasapostas.net/bilhete?banca=${options.casa_das_apostas_id}&codigo=${aposta.codigo}`;
    }

    wbPostMessage('shareURL', url, message, file)
}
