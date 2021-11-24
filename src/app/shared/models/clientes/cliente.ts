import {EnderecoViaCep} from '../endereco/endercoViaCep';
import {Endereco} from "../endereco/endereco";

export class Cliente {
    endereco?: Endereco | EnderecoViaCep;
    genero: string;
    email: string;
    dataNascimento: Date;
    dataRegistro: string;
    cpf: number;
    telefone: string;
    newsletter: boolean;
}
