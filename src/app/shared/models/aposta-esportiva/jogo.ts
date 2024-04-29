import { Estatistica } from './estatistica';
import { JogoInfo } from './jogo-info';
import { Campeonato } from './campeonato';
import { Cotacao } from './cotacao';

export class Jogo {
    id: number;
    _id: any;
    event_id: number;
    nome: string;
    time_a_nome: string;
    time_b_nome: string;
    time_a_img: string;
    time_b_img: string;
    horario: string;
    cancelado: boolean;
    finalizado: boolean;
    ao_vivo: boolean;
    sport_id: number;
    campeonato: Campeonato;
    cotacoes: Cotacao[];
    cotacoes_aovivo: Cotacao[];
    cotacoes_principais: Cotacao[];
    info: JogoInfo;
    favorito: string;
    estatisticas: Estatistica;
    total_cotacoes: number;
    resultado: any;
}
