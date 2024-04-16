import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { config } from '../../config';
import { UrlSerializer } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class CasinoApiService {

    private central_url = `${config.HOST}/casino`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private header: HeadersService,
        private serializer: UrlSerializer
    ) { }

    private queryString(data) {
        console.log(this.serializer.serialize(data));
        return this.serializer.serialize(data);
    }

    getApostas(queryParams?: any): Observable<any> {
        let requestOptions;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${config.BASE_URL}/casino/apostas/`, requestOptions)
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getGamesList(aoVivo: any) {
        if(aoVivo){
            var endpoint = this.central_url+"/games/gamesAoVivo";
        }else{
            var endpoint = this.central_url+"/games/";
        }
        return this.http.post(String(endpoint),{},this.header.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    getGamesHome() {
        var endpoint = this.central_url+"/games/gamesHome";
        return this.http.post(String(endpoint),{},this.header.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }

    getJogosLiberadosBonus() {
        return this.http.post(String(this.central_url+"/games/jogosLiberadosBonus"),{},this.header.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response;
                    }
                ),
                catchError(this.errorService.handleError)
            );
    }


    getGameUrl(gameId, gameMode, $gameFornecedor, isMobile) {
        let requestOptions;
        let queryParams = {};
        queryParams['token'] = localStorage.getItem('tokenCassino');
        queryParams['tokenUsuario'] = localStorage.getItem('token');
        queryParams['symbol'] = gameId;
        queryParams['language'] = 'pt';
        queryParams['playMode'] = gameMode;
        queryParams['cashierUr'] = `https://${config.SHARED_URL}/clientes/deposito`;
        queryParams['lobbyUrl'] = `https://${config.SHARED_URL}/casino/wall`;
        queryParams['fornecedor'] = $gameFornecedor;
        queryParams['isMobile'] = isMobile;


        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.central_url}/games/url`, requestOptions).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(this.errorService.handleError)
        );

    }

    getCasinoLiveKey(){
        let requestOptions;
        requestOptions = this.header.getRequestOptions(true);
        return this.http.get(`${this.central_url}/games/live`, requestOptions).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(this.errorService.handleError)
        );

    }

    closeSessionTomHorn(sessionId) {
        let requestOptions;
        let queryParams = {};
        queryParams['sessionId'] = sessionId;

        if (queryParams) {
            requestOptions = this.header.getRequestOptions(true, queryParams);
        } else {
            requestOptions = this.header.getRequestOptions(true);
        }

        return this.http.get(`${this.central_url}/games/closeSessionTomHorn`, requestOptions).pipe(
            map((res: any) => {
                return res;
            }),
            catchError(this.errorService.handleError)
        );
    }
}
