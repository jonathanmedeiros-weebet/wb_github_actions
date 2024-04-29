import { Jogo } from './jogo';

export class Campeonato {
    _id: number;
    nome: string;
    regiao: string;
    regiao_sigla: string;
    alias: string;
    sport_id:  number;
    jogos: Jogo[];
    isSelected? : boolean;
}
