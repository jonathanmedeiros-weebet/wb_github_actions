import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorService } from './error.service';

@Injectable()
export class CepService {
    constructor(private http: Http, private errorService: ErrorService) { }

    consultaCEP(cep) {
        //Nova variável "cep" somente com dígitos.
        cep = cep.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != '') {
            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {
                return this.http.get(`//viacep.com.br/ws/${cep}/json`).pipe(
                    catchError(this.errorService.handleError));
            } else {
                return observableThrowError('CEP inválido.');
            }
        }
    }
}
