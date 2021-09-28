import {EnderecoWeebet} from '../endereco/enderecoWeebet';
import {EnderecoViaCep} from '../endereco/endercoViaCep';

export class Cliente {
    endereco?: EnderecoWeebet | EnderecoViaCep;
    genero: string;
    email: string;
    dataNascimento: Date;
    dataRegistro: string;
    cpf: number;
    telefone: string;
    newsletter: boolean;
}
