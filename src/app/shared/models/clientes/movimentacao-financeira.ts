import {Deposito} from './deposito';
import {Saque} from './saque';

export class MovimentacaoFinanceira {
    data: string;
    tipo: string;
    natureza: string;
    valor = 0;
    saldo: string;
    deposito: Deposito;
    saque: Saque;
    is_bonus: boolean;
}
