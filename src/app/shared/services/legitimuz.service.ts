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

    private options:any = {
        host: LegitimuzService.API_LEGITIMUZ,
        token: '',
        lang: 'pt',
        enableRedirect: false,
        autoOpenValidation: false,
        onSuccess: (eventName) => console.log(eventName),
        onError: (eventName) => console.log(eventName),
        eventHandler:(eventName) => console.log(eventName),
        eveneventHandler:(eventName) => console.log(eventName),
    };

    private curCustomerIsVerifiedSub = new BehaviorSubject<boolean>(false);
    curCustomerIsVerified;

    constructor (
        private clienteService: ClienteService,
        private paramsService: ParametrosLocaisService
    ) {
        this.options.token = this.paramsService.getOpcoes().legitimuz_token;

        this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();
        if (JSON.parse(localStorage.getItem('user'))){

            const user = JSON.parse(localStorage.getItem('user'));
            
            this.options.onSuccess = (eventName) => {
                console.log(eventName)
                if (eventName === 'facematch') {
                    setTimeout(() => {
                        this.clienteService.getCliente(user.id)
                        .subscribe(customer => this.curCustomerIsVerifiedSub.next(customer.verifiedIdentity));
                    }, 1000);
                }
            };
        } else {
            this.options.onSuccess = (eventName) => {console.log(eventName)
            }
        }

        this.options.eventHandler = (eventName) => {
            console.log(eventName)
            console.log(this.options);
        };
        this.options.eveneventHandler = (eventName) => {
            console.log(eventName)
            console.log(this.options);
        };
        this.options.error = (eventName) => {
            console.log(eventName)
            console.log(this.options);
        };
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
