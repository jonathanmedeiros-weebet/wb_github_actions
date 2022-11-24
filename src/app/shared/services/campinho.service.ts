import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {from, Observable} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';

import {HeadersService} from './utils/headers.service';
import {ErrorService} from './utils/error.service';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class CampinhoService {
    private campinhoUrl = `${config.BASE_URL}/campinho`;

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {
    }

    // api.thesports.com/v1/football/bet365/match/list

    getIdsJogo(idBet): Observable<any> {

        return this.http.get(this.campinhoUrl, this.header.getRequestOptions(true, { id: idBet }))
            .pipe(
                take(1),
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );

        // const headers = {
        //     'Content-Type': 'application/json'
        // }

        // const user = 'betwee'
        // const secret = "343171fb6c93003203de52a99043f16e"
        // const params = { user, secret }


        // return this.http.get('https://api.thesports.com/v1/football/bet365/match/list', { headers, params })
        //     .pipe(
        //         take(1),
        //         map((res: any) => res.results),
        //         catchError(this.errorService.handleError)
        //     );


        // return from(
        //     fetch(
        //         'https://api.thesports.com/v1/football/bet365/match/list?user=betwee&secret=343171fb6c93003203de52a99043f16e', // the url you are trying to access
        //         {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         method: 'GET', // GET, POST, PUT, DELETE
        //         mode: 'no-cors' // the most important option
        //         }
        //     )
        // );
    }
}
