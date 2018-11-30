import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { Cotacao } from './../../../models';
import { config } from '../../config';

@Injectable()
export class CotacaoService {
    private CotacaoUrl = `${config.CENTER_API}/cotacoes`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

}
