import { DesafioOdd } from './desafio-odd';

export class Desafio {
    id: number;
    nome: string;
    dataHoraEncerramento: string;
    bloqueado: boolean;
    removido: boolean;
    odds: DesafioOdd[];
}
