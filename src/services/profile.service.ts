import { axiosInstance } from "./axiosInstance"
import { useConfigClient } from "@/stores";
import { localStorageService } from "@/services";

export const changePassword = async (
    currentPass: string,
    newPass: string,
    confirmPass: string
) => {

    const { apiUrl } = useConfigClient();
    const url = `${apiUrl}/usuarios/alterar_senha`;
    const token = localStorageService.get('token');
  
    if (!token) {
        return false
    }

    const payload = {
        senha_atual: currentPass,
        senha_nova: newPass,
        senha_confirmacao: confirmPass
    }

    return await axiosInstance().put(url, payload, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
  
}