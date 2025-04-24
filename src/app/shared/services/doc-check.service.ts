import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

declare var exDocCheck: any;


@Injectable({
  providedIn: 'root'
})
export class DocCheckService {

  private iframeMessageSubject = new Subject<any>();

  iframeMessage$ = this.iframeMessageSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  observer(hash, date) {
    const interval = setInterval(async () => {
      const response = await this.httpClient.get(`https://api.exato.digital/doccheck/validation-identity/status?hash=${hash}&ex_doccheck_session_start_timestamp=${date}`)
      .pipe(
        take(1),
        map((res: any) => {
          if (!Boolean(res.Status == 'EM_VALIDACAO' || res.Status == 'REQUER_VALIDACAO_MANUAL')) {
            clearInterval(interval);
          }
          this.iframeMessageSubject.next({StatusPostMessage: res});
          return res;
        })
      ).toPromise()
    }, 3000);
  }

  hmacHash(cpf, secret_key) {
    let hash = CryptoJS.HmacSHA256(cpf , secret_key);
    hash = hash.toString(CryptoJS.enc.Hex);
    this.observer(hash, new Date().toISOString());
    return hash;
  }
  
  init() {
    exDocCheck.init();
  }

  closeModal() {
    document.getElementById('ex-doccheck-close').click();
  }

  private handleMessage(event: MessageEvent) {
    if (event.origin !== 'https://doccheck.exato.digital') {
      return; 
    }
    if (event.data.StatusPostMessage) {
      this.iframeMessageSubject.next(event.data);
    }
  }
  
}

