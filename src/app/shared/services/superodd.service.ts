import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { ApostaEsportiva, DesafioItemBilhete } from '../../models';
import { config } from '../config';
import { MenuFooterService } from './utils/menu-footer.service';

@Injectable()
export class SuperoddService {
    private itensSource = new BehaviorSubject<any[]>([]);
    private SuperoddUrl = `${config.BASE_URL}/superodds`;
    private PreBetUrl = `${config.BASE_URL}/preapostas`
    public itensAtuais = this.itensSource.asObservable();

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService,
        private menuFooterService: MenuFooterService,
    ) { }


    getSuperodds() {
        let requestOptions;

        requestOptions = this.header.getRequestOptions(true);

        return this.http.get(this.SuperoddUrl, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getBets(queryParams?): Observable<any[]> {
        const url = `${this.SuperoddUrl}/bets`;
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getBet(id: number, queryParams?): Observable<ApostaEsportiva> {
        const url = `${this.SuperoddUrl}/bets/${id}`;
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(url, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    createBet(data): Observable<any> {
        const url = `${this.SuperoddUrl}/bets`;

        return this.http.post(url, data, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getPreAposta(id: number): Observable<any> {
        const url = `${this.PreBetUrl}/${id}`;

        return this.http.get(url, this.header.getRequestOptions(true))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    createPreBet(data): Observable<any> {
        const url = `${this.PreBetUrl}/superodds`;

        return this.http.post(url, data, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    atualizarItens(itens): void {
        this.menuFooterService.atualizarQuantidade(itens.length);
        this.itensSource.next(itens);
    }
}
