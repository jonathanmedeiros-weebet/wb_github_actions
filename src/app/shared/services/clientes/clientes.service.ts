import {Injectable} from '@angular/core';
import {config} from '../../config';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from '../utils/error.service';
import {HeadersService} from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private clienteUrl = `${config.BASE_URL}/clientes`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private headers: HeadersService
    ) {
    }

    getTermosDeUso() {
        return this.http.get(`${this.clienteUrl}/termos-uso`, this.headers.getRequestOptions())
            .pipe(
                map((response: any) => {
                    return response.results;
                }),
                catchError(this.errorService.handleError));
    }

    cadastrarCliente(values: any) {
        return this.http.post(`${this.clienteUrl}/cadastro`, JSON.stringify(values))
            .pipe(
                map((response: any) => {
                        return response.results.result;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }
}
