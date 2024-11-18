import {EnderecoViaCep} from '../endereco/endercoViaCep';
import {Endereco} from "../endereco/endereco";

export class Cliente {
    endereco?: Endereco | EnderecoViaCep;
    email: string;
    dataNascimento: Date;
    dataRegistro: string;
    cpf: number;
    telefone: string;
    newsletter: boolean;
    chave_pix: string;
    nome: string;
    sobrenome: string;
    verifiedIdentity: boolean;
}
