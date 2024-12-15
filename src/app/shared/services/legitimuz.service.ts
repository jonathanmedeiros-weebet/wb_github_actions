import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { ClienteService } from "./clientes/cliente.service";
import { ParametrosLocaisService } from "./parametros-locais.service";

declare var Legitimuz: any;

@Injectable({
    providedIn: 'root'
})
export class LegitimuzService {

    private sdk;

    private static API_LEGITIMUZ: String = "https://api.legitimuz.com";

    private options: any = {
        host: LegitimuzService.API_LEGITIMUZ,
        token: '',
        lang: 'pt',
        enableRedirect: false,
        autoOpenValidation: false,
        onlyLiveness: false,
        onSuccess: (eventName) => console.log(eventName)
    };

    private curCustomerIsVerifiedSub = new BehaviorSubject<boolean>(null);
    curCustomerIsVerified;
    private faceIndexSub = new BehaviorSubject<boolean>(null);
    faceIndex;

    constructor (
        private clienteService: ClienteService,
        private paramsService: ParametrosLocaisService
    ) {
        this.options.token = this.paramsService.getOpcoes().legitimuz_token;

        this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();
        this.faceIndex = this.faceIndexSub.asObservable();
        if (JSON.parse(localStorage.getItem('user'))) {

            const user = JSON.parse(localStorage.getItem('user'));

            this.options.onSuccess = (eventName) => {
                console.log("LEGITIMUZ w/ user - Success: ", eventName);
                if (eventName === 'facematch') {
                    setTimeout(() => {
                        if (user.id) {
                            console.log("USER.ID LEGITIMUZ: ", user.id);
                            this.clienteService.getCliente(user.id)
                                .subscribe(customer => this.curCustomerIsVerifiedSub.next(customer.verifiedIdentity));
                        } else {
                            this.curCustomerIsVerifiedSub.next(false);
                        }
                    }, 1000);
                }
            };
        } else {
            this.options.onSuccess = (eventName) => {
                console.log("LEGITIMUZ - Success: ", eventName);
                if (eventName === 'facematch') {
                    console.log("OK FACEMATCH");
                    this.curCustomerIsVerifiedSub.next(true);
                    this.closeModal();
                }
            }
        }
    }

    init() {
        this.sdk = Legitimuz(this.options);
    }

    mount() {
        this.sdk.mount();
    }

    changeLang(lang: string) {
        this.sdk.setLang(lang);
    }

    toggleEnableRedirect(enable: boolean) {
        this.options.enableRedirect = enable;
    }

    toggleAutoOpenValidation(enable: boolean) {
        this.options.autoOpenValidation = enable;
    }

    closeModal() {
        this.sdk.closeModal();
    }

}
