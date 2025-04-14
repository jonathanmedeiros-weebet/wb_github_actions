import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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

    private curCustomerIsVerifiedSub = new BehaviorSubject<boolean>(false);
    curCustomerIsVerified;

    constructor (
        private paramsService: ParametrosLocaisService
    ) {
        this.options.token = this.paramsService.getOpcoes().legitimuz_token;

        this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();

        this.options.onSuccess = (eventName) => {
            if (eventName === 'facematch' && !this.curCustomerIsVerifiedSub.getValue()) {
                setTimeout(() => {
                    this.curCustomerIsVerifiedSub.next(true);
                    this.closeModal();

                }, 1000);
            }
        }
    }

    init() {
        if(this.curCustomerIsVerifiedSub.getValue()) this.curCustomerIsVerifiedSub.next(false);
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
