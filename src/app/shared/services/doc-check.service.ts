import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

declare var exDocCheck: any;


@Injectable({
  providedIn: 'root'
})
export class DocCheckService {

  private iframeMessageSubject = new Subject<any>();

  iframeMessage$ = this.iframeMessageSubject.asObservable();

  constructor() {

    window.addEventListener('message', this.handleMessage.bind(this), false);
   }


  hmacHash(cpf, secret_key) {
    const concatenatedString = cpf + secret_key;
    const hash = CryptoJS.SHA256(concatenatedString);
    return hash.toString(CryptoJS.enc.Hex);
  }
  
  init() {
    exDocCheck.init();
  }

  private handleMessage(event: MessageEvent) {
    if (event.origin !== 'https://doccheck.exato.digital') {
      return; 
    }
    if (event.data.StatusPostMessage) {
      this.iframeMessageSubject.next(event.data);
      console.log(event.data.StatusPostMessage);
    }
  }
  
}

