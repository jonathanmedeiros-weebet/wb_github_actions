import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class HeadersService {
    constructor() { }

    getRequestOptions(sendToken?: boolean, queryParams?: any) {
        const token = localStorage.getItem('token');

        let headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        headers = headers.set('Content-Type', 'application/jsond');

        if (sendToken) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        let params = new HttpParams();
        if (queryParams) {
            for (const key in queryParams) {
                if (queryParams.hasOwnProperty(key)) {
                    params = params.set(key, queryParams[key]);
                }
            }
        }

        return {
            headers: headers,
            params: params
        };
    }
}
