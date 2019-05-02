export class CartaoAposta {
    id: number;
    chave: string;
    apostador: string;
    valor: Number;
    bonus: Number;
    saldo: Number;
    cambista: any;
    data_registro: string;
    apostas: any[];
    total_creditos: number;
    total_saques: number;
}
