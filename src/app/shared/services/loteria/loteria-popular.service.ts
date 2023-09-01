import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';

import { HeadersService } from '../utils/headers.service';
import { ErrorService } from '../utils/error.service';
import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class LoteriaPopularService {

    private loteria_popular_url = `${config.LOTTERIES_URL}/loteria-popular`;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private header: HeadersService
    ) { }

    getGameUrl() {
        return this.http.get(`${this.loteria_popular_url}/url`, this.header.getRequestOptions(true))
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError(this.errorService.handleError)
            );
    }
}
