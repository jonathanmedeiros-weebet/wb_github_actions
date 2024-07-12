import VueRouter from "vue-router";
import { axiosInstance } from "./axiosInstance";
import { useConfigClient } from "@/stores";
import { localStorageService } from "./storage.service";
import { verifyToken } from "@/services";

export const prepareConfigClient = async () => {
    const route = new VueRouter().currentRoute;
    const configClienteStore = useConfigClient();

    configClienteStore.setReadyForUse(false);

    const {name, host, slug} = route.query;
    if(Boolean(name) && Boolean(host) && Boolean(slug)) {
        configClienteStore.setConfig({
            name: name as string,
            slug: slug as string,
            apiUrl: host as string
        });
    }
   
    const params = await getParams();
    configClienteStore.setParams(params);
    configClienteStore.setReadyForUse(true);

    console.warn('config client montado!')
}


export const getParams = async () => {
    const { paramUrl } = useConfigClient();
    return await axiosInstance().get(paramUrl)
}

export const checkToken = async () => {
    const token = localStorage.getItem('token');
    if(!token) {
        localStorageService.removeAll();
        return false;
    }
    return verifyToken();
}