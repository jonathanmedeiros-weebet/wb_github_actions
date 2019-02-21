import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { config } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    constructor(
        private http: HttpClient
    ) { }

    registrar(err): Observable<any> {
        const url = `${config.BASE_URL}/error`;
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/jsond');

        return this.http.post(url, JSON.stringify(err), { headers: headers });
    }
}
