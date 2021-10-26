import {Endereco} from './endereco';
import {Cidade} from './cidade';
import {Estado} from './estado';

export class EnderecoWeebet extends Endereco {
    numero: number;
    cidade:  Cidade;
    estado: Estado;
}
