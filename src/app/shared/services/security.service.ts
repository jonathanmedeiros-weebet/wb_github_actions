import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { config } from '../config';

declare const LegitimuzAntiFraude: any;

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    private Security = `${config.LOKI_URL}/security`;

    synchronized = false;

    private tokenLegitimuz = "00b89dce-3d03-4a4a-88ea-84eb9a3c23f3";
    private tokenProxyCheck = "public-88207e-p2t4z0-554957";

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {}

    analyseIp() {
        this.http.get(`${this.Security}`, this.header.getRequestOptions(false))
            .subscribe((res: any) => {
                    return res.results;
                },
                error => {
                    catchError(this.errorService.handleError);
                }
            );
    }

    async isVPN(): Promise<boolean> {
        try {
            const sdkInstance = LegitimuzAntiFraude({
                apiURL: "https://api.legitimuz.com",
                token: this.tokenLegitimuz,
                action: "check",
                enableRequestGeolocation: true
            });

            sdkInstance.mount();
            const legitiumuzResponse = await sdkInstance.sendAnalisys({ cpf: '11111111111' });
            console.log('RESPONSE LEGITIMUZ:', legitiumuzResponse);

            const response: any = await fetch(`https://proxycheck.io/v2/?key=${this.tokenProxyCheck}&vpn=1`);
            const responseData = await response.json();

            if (responseData[responseData.ip].proxy === 'yes') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
