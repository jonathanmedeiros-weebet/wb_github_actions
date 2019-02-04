import { JogoInfo } from './jogo-info';
import { Campeonato } from './campeonato';
import { Cotacao } from './cotacao';

export class Jogo {
    id: number;
    _id: any;
    nome: string;
    time_a_nome: string;
    time_b_nome: string;
    horario: string;
    cancelado: boolean;
    finalizado: boolean;
    ao_vivo: boolean;
    campeonato: Campeonato;
    cotacoes: Cotacao[];
    cotacoes_principais: Cotacao[];
    info: JogoInfo;
    favorito: string;
}
