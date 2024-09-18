import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { ClienteService } from "./clientes/cliente.service";
import { ParametrosLocaisService } from "./parametros-locais.service";

declare var Legitimuz: any;
declare var LegitimuzFaceIndex: any;

@Injectable({
    providedIn: 'root'
})
export class LegitimuzService {

    private sdk;
    cadastroSub = new BehaviorSubject<any>(true);
    cadastro;

    private static API_LEGITIMUZ: String = "https://api.legitimuz.com";
    private static API_LEGITIMUZ_LIVENESS: String = "https://liveness.legitimuz.com";

    private options = {
        host: LegitimuzService.API_LEGITIMUZ,
        apiURL : LegitimuzService.API_LEGITIMUZ,
        appURL : LegitimuzService.API_LEGITIMUZ_LIVENESS,
        token: '',
        lang: 'pt',
        enableRedirect: false,
        autoOpenValidation: false,
        onSuccess: (eventName) => console.log(eventName),
        onError: (eventName) => console.log(eventName),
        eventHandler:(eventName) => console.log(eventName),
    };

    private curCustomerIsVerifiedSub = new BehaviorSubject<boolean>(false);
    curCustomerIsVerified;

    constructor (
        private clienteService: ClienteService,
        private paramsService: ParametrosLocaisService
    ) {
        this.options.token = this.paramsService.getOpcoes().legitimuz_token;

        this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();
        this.cadastro = this.cadastroSub.asObservable();
        this.cadastroSub.subscribe({next: (res)=>
        {
            this.init();
        }
        })
        
        if (JSON.parse(localStorage.getItem('user'))){

            const user = JSON.parse(localStorage.getItem('user'));
            
            this.options.onSuccess = (eventName) => {
                if (eventName === 'facematch') {
                    setTimeout(() => {
                        this.clienteService.getCliente(user.id)
                        .subscribe(customer => this.curCustomerIsVerifiedSub.next(customer.verifiedIdentity));
                    }, 1000);
                }
            };
        }

        this.options.eventHandler = (eventName) => {
            console.log(eventName)
            console.log(this.options);
        };
    }

    init() {
        if (this.cadastroSub.value) {
            this.options.host = LegitimuzService.API_LEGITIMUZ;
            this.sdk = Legitimuz(this.options);
        } else {  
            this.sdk = LegitimuzFaceIndex(this.options);
        }
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
