import { useConfigClient } from "@/stores";
import { axiosInstance } from "./axiosInstance"

export const checkLive = async ( jogosApiIds: any ) => {
    const params = new URLSearchParams();
    
    jogosApiIds.forEach((id: any) => {
        params.append('jogos[]', id);
    });

    const { centerUrl } = useConfigClient();
    const url = `${centerUrl}/jogos/verificar-ao-vivo`;
    
    return await axiosInstance().get(url, { params });
}

