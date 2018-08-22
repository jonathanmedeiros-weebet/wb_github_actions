import { Jogo } from './jogo';
import { ApostaEsportivaTipo } from './aposta-esportiva-tipo';

export class ItemPreApostaEsportiva {
    jogo_id: number;
    jogo: Jogo;
    aposta_id: number;
    aposta_tipo_id: number;
    aposta_tipo: ApostaEsportivaTipo;
    cotacao: number;
    ao_vivo: boolean;
}
