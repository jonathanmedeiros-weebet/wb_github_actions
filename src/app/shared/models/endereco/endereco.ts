import {Cidade} from "./cidade";
import {Estado} from "./estado";

export class Endereco {
    logradouro: string;
    bairro: string;
    cep: number;
    numero: number;
    cidade: Cidade;
    estado: Estado;
    complement?: string;
}
