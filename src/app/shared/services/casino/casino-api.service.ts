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

  private sortObjectByKeys(object) {
    return Object.keys(object).sort().reduce((r, k) => (r[k] = object[k], r), {});
  }

  private calculeHash(data) {

    data = this.sortObjectByKeys(data)

    let preHash = [];
    let paramStr: String = '';


    for (let key of Object.keys(data)){
      preHash.push(key+"="+data[key]);
    }

    paramStr = preHash.join('&');
    console.log(paramStr+environment.casinoKey)

    return Md5.hashStr(paramStr+environment.casinoKey)
  }

  createUser(data){

    data = this.sortObjectByKeys(data)

    data.hash = this.calculeHash(data)

    console.log(data)
    this.queryString(data);
    console.log(`${environment.casinoApiUrl}/player/account/create/`)

    return this.http.post(`${environment.casinoApiUrl}/player/account/create/`, data)
            .pipe(
                map(
                    (response: any) => {
                        return response.results;
                    }
                ),
                catchError(this.errorService.handleError)
            );

  }



  getGamesList(){

    return this.http.post(`${this.central_url}/games/`,{})
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
  queryParams['secureLogin'] = 'weebet_weebet';
  queryParams['symbol'] = gameId;
  queryParams['language'] = 'pt';
  queryParams['token'] =
  queryParams['playMode'] = gameMode

  if(gameMode=='REAL'){
    queryParams['token'] = localStorage.getItem('token')
  }


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
}
