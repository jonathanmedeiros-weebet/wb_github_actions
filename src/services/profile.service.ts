import { axiosInstance } from "./axiosInstance"
import { useConfigClient } from "@/stores";

export const changePassword = async (
    currentPass: string,
    newPass: string,
    confirmPass: string
) => {

    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/user/change-password`
    
    const payload = {
        senha_atual: currentPass,
        senha_nova: newPass,
        senha_confirmacao: confirmPass
    }
    return await axiosInstance().put(url, payload);
  
}