import { ApostaEsportivaTipo } from './aposta-esportiva-tipo';
import { Jogo } from './jogo';

export class ItemApostaEsportiva {
    constructor() { }

    aposta_id: number;
    aposta_tipo_id: number;
    aposta_tipo: ApostaEsportivaTipo;
    jogo_id: number;
    jogo: Jogo;
    cotacao: number;
    status: string;
    jogo_horario: string;
    resultado: string;
    removido: boolean;
    campeonato;
}
