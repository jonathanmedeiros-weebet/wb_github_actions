import { JogoInfo } from './jogo-info';
import { Campeonato } from './campeonato';
import { Cotacao } from './cotacao';

export class Jogo {
    _id: string;
    nome: string;
    time_a_nome: string;
    time_b_nome: string;
    horario: string;
    cancelado: boolean;
    finalizado: boolean;
    campeonato: Campeonato;
    cotacoes_principais: Cotacao[];
    info: JogoInfo;
}
