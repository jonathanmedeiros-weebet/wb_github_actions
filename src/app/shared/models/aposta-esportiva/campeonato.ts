import { Jogo } from './jogo';

export class Campeonato {
    _id: number;
    nome: string;
    regiao: string;
    regiao_sigla: string;
    jogos: Jogo[];
}
