import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { CustomEncoder } from '../../utils';
import {TranslateService} from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HeadersService {
    private fullScreenCasinoGame = new BehaviorSubject<boolean>(false);
    fullScreenCasinoGameState$ = this.fullScreenCasinoGame.asObservable();

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

    getIsHeaderDisabled() {
        return this.fullScreenCasinoGame.value;
    }

    openCasinoFullScreen() {
        this.fullScreenCasinoGame.next(true);
    }

    closeCasinoFullScreen() {
        this.fullScreenCasinoGame.next(false);
    }
}
