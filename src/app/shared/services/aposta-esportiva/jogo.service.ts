import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HeadersService } from './../utils/headers.service';
import { ErrorService } from './../utils/error.service';
import { Jogo, Cotacao, Campeonato } from './../../../models';
import { config } from '../../config';

@Injectable()
export class JogoService {
    private JogoUrl = `${config.CENTER_API}/jogos`;
    private JogosLokiUrl = `${config.LOKI_URL}/games`;
    private JogoCentralUrl = `${config.BASE_URL}/jogos`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) { }

    getJogo(id: Number): Observable<any> {
        const url = `${this.JogoUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    verficarAoVivo(jogos): Observable<any> {
        const url = `${this.JogoUrl}/verificar-ao-vivo`;

        let params = new HttpParams({
            fromObject: { 'jogos[]': jogos }
        });

        return this.http.get(url, { params })
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            )
    }

    getCotacoes(id: number): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getJogosAoVivo() {
        const url = `${this.JogoUrl}/ao-vivo`;

        return this.http.get(url, this.header.getRequestOptions(true, {new_api: true}))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }

    getJogosDestaque() {
        const url = `${this.JogoCentralUrl}/destaques`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res),
                catchError(this.errorService.handleError)
            );
    }

    getCotacao(id: number, chave: string): Observable<Cotacao[]> {
        const url = `${this.JogoUrl}/${id}/cotacoes/${chave}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.result),
                catchError(this.errorService.handleError)
            );
    }
}
