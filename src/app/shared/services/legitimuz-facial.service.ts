import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClienteService } from './clientes/cliente.service';
import { ParametrosLocaisService } from './parametros-locais.service';

declare var LegitimuzFaceIndex: any;

@Injectable({
  providedIn: 'root'
})
export class LegitimuzFacialService {

  private sdk;

  private static API_LEGITIMUZ: String = "https://api.legitimuz.com";
  private static API_LEGITIMUZ_LIVENESS: String = "https://widget.legitimuz.com";

  private options:any = {
      host: LegitimuzFacialService.API_LEGITIMUZ,
      apiURL: LegitimuzFacialService.API_LEGITIMUZ,
      appURL :LegitimuzFacialService.API_LEGITIMUZ_LIVENESS, 
      token: '',
      lang: 'pt',
      enableRedirect: false,
      autoOpenValidation: false,
      onlyLiveness : true,
      onSuccess: (eventName) => console.log(eventName),
      onError: (eventName) => console.log(eventName),
      eventHandler:(eventName) => console.log(eventName),
  };

  private curCustomerIsVerifiedSub = new BehaviorSubject<boolean>(false);
  curCustomerIsVerified;
  private faceIndexSub = new BehaviorSubject<boolean>(false);
  faceIndex;

  constructor (
      private clienteService: ClienteService,
      private paramsService: ParametrosLocaisService
  ) {
      this.options.token = this.paramsService.getOpcoes().legitimuz_token; 
      this.curCustomerIsVerified = this.curCustomerIsVerifiedSub.asObservable();
      this.faceIndex = this.faceIndexSub.asObservable();
      this.options.onSuccess = (eventName) => {
        console.log(eventName);
        if (eventName.name == 'faceindex' && eventName.type == 'success') {
          console.log('faceindex: Success');
          this.faceIndexSub.next(true)
          }
      }

      this.options.eventHandler = (eventName) => {
            console.log('1',eventName.name);
            console.log('1',eventName.type);
          if (eventName == 'faceindex') {
            console.log(eventName);
          } else {
            console.log('Else',eventName.name);
            console.log('Else',eventName.type);
          }
          if (eventName.name == 'faceindex' && eventName.type == 'success') {
            console.log('faceindex: Success')
            this.faceIndexSub.next(true)
        }
      };
  }

  init() {
    this.sdk = LegitimuzFaceIndex(this.options);    
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

