import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { config } from '../config';
import { GeolocationService } from './geolocation.service';
import { AuthService } from './auth/auth.service';
import { LogoutMessageModalComponent } from '../components/logout-message-modal.component';
import { TranslateService } from '@ngx-translate/core';

declare const LegitimuzAntiFraude: any;

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    private loki_url = `${config.LOKI_URL}`;

    synchronized = false;

    private tokenLegitimuz = "00b89dce-3d03-4a4a-88ea-84eb9a3c23f3";
    private tokenProxyCheck = "public-88207e-p2t4z0-554957";

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private header: HeadersService,
        private geolocation: GeolocationService,
        private errorService: ErrorService,
        private modalService: NgbModal,
        private router: Router,
        private translate: TranslateService
    ) { }

    analyzeGeoLocation() {
        this.geolocation.getCurrentPosition()
        .then(pos => {
            if (!pos.error) {
                this.http.get(
                    `${this.loki_url}/geolocation/analyze`,
                    this.header.getRequestOptions(true, { latitude: pos.lat, longitude: pos.lng } )
                )
                .pipe(
                    map((res: any) => res.results),
                    catchError(error => {
                        this.showLogoutModal();
                        return this.errorService.handleError(error);
                    })
                )
                .subscribe(
                    (res: any) => {
                        if (!res.viable) {
                            this.showLogoutModal();
                        }
                    }
                );
            } else {
                this.showLogoutModal();
            }
        })
        .catch(error => {
            console.log('Geolocation Error:', error);
            this.showLogoutModal(this.translate.instant('geral.geolocationError'));
        })
    }

    async isVPN(): Promise<boolean> {
        try {
            const sdkInstance = LegitimuzAntiFraude({
                apiURL: "https://api.legitimuz.com",
                token: this.tokenLegitimuz,
                action: "check",
                enableRequestGeolocation: true
            });

            //sdkInstance.mount();
            //const legitiumuzResponse = await sdkInstance.sendAnalisys({ cpf: '07281754442' });

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

    private showLogoutModal(message: string = null) {
        const modalRef = this.modalService.open(LogoutMessageModalComponent, { centered: true });
        modalRef.result.then((result) => {
            this.auth.logout();
        }, (reason) => {
            console.log('MODAL LOGOUT:', reason);
            this.auth.logout();
        });
        modalRef.componentInstance.message = message ?? this.translate.instant('geral.logoutGeolocationErrorMessage');
        modalRef.componentInstance.title = this.translate.instant('geral.logoutGeolocationErrorTitle');
        modalRef.componentInstance.buttonLabel = this.translate.instant('geral.logoutGeolocationErrorButtonLabel');
    }
}
