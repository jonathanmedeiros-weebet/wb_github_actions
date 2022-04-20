import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { Md5 } from 'ts-md5';
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
        console.log(this.serializer.serialize(data))
        return this.serializer.serialize(data)
    }

    getGamesList(){

        return this.http.post(`${this.central_url}/games/`,{},this.header.getRequestOptions(true))
            .pipe(
                map(
                    (response: any) => {
                        return response;
                    }
                ),
                catchError(this.errorService.handleError)
            );

    }


    getGameUrl(gameId, gameMode){
        let requestOptions;
        let queryParams = {}
        queryParams['symbol'] = gameId;
        queryParams['language'] = 'pt';
        queryParams['playMode'] = gameMode;
        queryParams['lobbyUrl'] = `https://${config.SHARED_URL}/casino/wall`;

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
}
