import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"
import { localStorageService } from "@/services";

export const authUser = async (
    username: string,
    password: string,
) => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/auth/login`;
    
    const user = {
        username: username,
        password: password
    }
    try {
        const resp = await axiosInstance().post(url, user); 

        if(resp.success){
            console.log(resp);
            //TODO: VERIFICAR O TIPO DE USUÁRIO (CAMBISTA)
            // if(resp.results.user.tipo_usuario == 'cambista'){
                localStorageService.set('token', resp.results.token);
                localStorageService.set('user', resp.results.user);
                return true;   
            // }
        }
        return false;
    } catch (error) {
        localStorageService.removeAll();
        throw error;
    }
}

export const verifyToken = async () => {

    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/auth/verify-token`;
    const token = localStorageService.get('token');
  
    if (!token) {
        return false
    }
  
    try {
        const resp = await axiosInstance().get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if(resp){
            if(resp.results == true){
                return true;
            }
        }

        return false;

    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            console.error('Token inválido ou expirado');
        }
        return false;
    }
};