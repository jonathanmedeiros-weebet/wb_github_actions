import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { CustomEncoder } from '../../utils';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class HeadersService {
    currentLanguage = 'pt';
    
    constructor(private translate: TranslateService) {
        this.currentLanguage = this.translate.currentLang ?? localStorage.getItem('linguagem') ?? 'pt';
        this.translate.onLangChange.subscribe(res => {
            this.currentLanguage = res.lang;
        });
    }

    getRequestOptions(sendToken?: boolean, queryParams?: any) {
        const token = localStorage.getItem('token');

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language': this.currentLanguage
        });

        if (sendToken) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        let params = new HttpParams({ encoder: new CustomEncoder() });
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
