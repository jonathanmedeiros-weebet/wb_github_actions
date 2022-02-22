import {Deposito} from "./deposito";

export class MovimentacaoFinanceira {
    data: string;
    tipo: string;
    natureza: string;
    valor = 0;
    saldo: string;
    deposito: Deposito;
    is_bonus: boolean;
}
