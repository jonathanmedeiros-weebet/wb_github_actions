import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ParametrosLocaisService } from './parametros-locais.service';

declare var LegitimuzFaceIndex: any;
const API_LEGITIMUZ: string = "https://api.legitimuz.com";
const API_LEGITIMUZ_LIVENESS: string = "https://widget.legitimuz.com";

@Injectable({
  providedIn: 'root'
})
export class LegitimuzFacialService {
  private sdk;
  private options:any = {
      host: API_LEGITIMUZ,
      apiURL: API_LEGITIMUZ,
      appURL :API_LEGITIMUZ_LIVENESS,
      token: '',
      lang: 'pt',
      enableRedirect: false,
      autoOpenValidation: false,
      onlyLiveness : true,
      onSuccess: (eventName: string) => console.log(eventName),
      eventHandler:(eventName: string) => console.log(eventName)
  };

  private faceIndexSub = new BehaviorSubject<boolean>(false);
  public faceIndex: any;

  constructor (
      private paramsService: ParametrosLocaisService
  ) {
    this.options.token = this.paramsService.getOpcoes().legitimuz_token;
    this.faceIndex = this.faceIndexSub.asObservable();
    this.options.onSuccess = (eventName) => {
      if (eventName.name == 'faceindex' && eventName.status == 'success' && !this.faceIndexVerified) {
        this.faceIndexSub.next(true)
      }
    }

    this.options.eventHandler = (eventName) => {
      if (eventName.name == 'faceindex' && eventName.status == 'success' && !this.faceIndexVerified) {
        this.faceIndexSub.next(true)
      }
    };
  }

  get faceIndexVerified() : boolean {
    return this.faceIndexSub.getValue();
  }

  init() {
    if(this.faceIndexVerified) this.faceIndexSub.next(false);
    this.sdk = LegitimuzFaceIndex(this.options);
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
