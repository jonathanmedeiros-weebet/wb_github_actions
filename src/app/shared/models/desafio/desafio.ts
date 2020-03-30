import { DesafioOdd } from './desafio-odd';

export class Desafio {
    id: number;
    nome: string;
    data_hora_Encerramento: string;
    bloqueado: boolean;
    removido: boolean;
    odd_correta: DesafioOdd;
    odds: DesafioOdd[];
}
