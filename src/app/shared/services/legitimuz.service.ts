import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ParametrosLocaisService } from "./parametros-locais.service";

declare var Legitimuz: any;
const API_LEGITIMUZ: string = "https://api.legitimuz.com";

@Injectable({
    providedIn: 'root'
})
export class LegitimuzService {

    private sdk: any;
    private options: any = {
        host: API_LEGITIMUZ,
        token: '',
        lang: 'pt',
        enableRedirect: false,
        autoOpenValidation: false,
        onlyLiveness: false,
        onSuccess: (eventName: string) => console.log(eventName)
    };

    private curCustomerIsVerifiedSub: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
    public curCustomerIsVerified: any;

    constructor (
        private paramsService: ParametrosLocaisService
    ) {
        this.options.token = this.paramsService.getOpcoes().legitimuz_token;
        this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();
        this.options.onSuccess = (eventName) => {
            if (eventName === 'facematch' && !Boolean(this.isVerified)) {
                this.curCustomerIsVerifiedSub.next(true);
                this.closeModal();
            }
        }
    }

    get isVerified(): boolean | null {
        return this.curCustomerIsVerifiedSub.getValue();
    }

    init() {
        if(this.isVerified != null) {
            this.curCustomerIsVerifiedSub.next(null);
        }
        this.sdk = Legitimuz(this.options);
    }

    mount() {
        this.sdk.mount();
    }

    changeLang(lang: string) {
        this.sdk.setLang(lang);
    }

    closeModal() {
        this.sdk.closeModal();
    }
}
