import { axiosInstance } from "./axiosInstance";
import { useConfigClient } from "@/stores";

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
   
    const params = await getParams();
    setParams(params);
    setReadyForUse(true);
}

export const getParams = async () => {
    const { paramUrl } = useConfigClient();
    return await axiosInstance().get(paramUrl)
}
