import {Endereco} from './endereco';

export class EnderecoViaCep  extends Endereco {
    complemento:    string;
    localidade:     string;
    uf:             string;
    gia:            string;
    ddd:            number;
    siafi:          number;
    ibge:           number;
}
