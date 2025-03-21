import { axiosInstance } from "./axiosInstance";
import { useConfigClient } from "@/stores";
import { LocalStorageKey, localStorageService } from "@/services";

export const prepareConfigClient = async (route: any) => {
    const {
        setConfig,
        setReadyForUse,
        setParams
    } = useConfigClient();

    setReadyForUse(false);

    const {name, host, slug} = route.query;

    if(Boolean(name) && Boolean(host) && Boolean(slug)) {
        setConfig({
            name: name as string,
            slug: slug as string,
            host: host as string
        });
    }

    getBetTypes();

    const params = await getParams();
    setParams(params);
    setReadyForUse(true);
}

export const getParams = async () => {
    const { paramUrl } = useConfigClient();
    return await axiosInstance().get(paramUrl)
}

export const getBetTypes = async () => {
    const { lokiUrl } = useConfigClient();

    const betTypeUrl = `${lokiUrl}/parameters/bet-type`;
    try {
        const resp: any = await axiosInstance().get(betTypeUrl);
        
        localStorageService.remove(LocalStorageKey.BET_TYPES);
        localStorageService.set(LocalStorageKey.BET_TYPES, resp.results);

        return resp.results;
    }
    catch (error) {
        console.error('Error getting quotes:', error);
    }
}