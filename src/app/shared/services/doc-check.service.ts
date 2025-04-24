import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

declare var exDocCheck: any;


@Injectable({
  providedIn: 'root'
})
export class DocCheckService {

  private iframeMessageSubject = new Subject<any>();

  iframeMessage$ = this.iframeMessageSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  observer(hash) {
    console.log('iniciou observer')

    const interval = setInterval(async () => {
    console.log('iniciou request')
      
      const response = await this.httpClient.get(`https://api.exato.digital/doccheck/validation-identity/status?hash=${hash}`)
      .pipe(
        take(1),
        map((res) => {
          console.log(' observer', res)
          this.iframeMessageSubject.next({StatusPostMessage: res});
          return res;
        })
      ).toPromise()

    console.log('terminou request')
    console.log('terminou request', response)

    }, 3000);
  }

  hmacHash(cpf, secret_key) {
    let hash = CryptoJS.HmacSHA256(cpf , secret_key);
    hash = hash.toString(CryptoJS.enc.Hex);

    this.observer(hash)
    return hash;
  }
  
  init() {
    exDocCheck.init();
  }

  private handleMessage(event: MessageEvent) {
    console.log('handleMessage => ', event)
    if (event.origin !== 'https://doccheck.exato.digital') {
      return; 
    }
    if (event.data.StatusPostMessage) {
      this.iframeMessageSubject.next(event.data);
    }
  }
  
}

