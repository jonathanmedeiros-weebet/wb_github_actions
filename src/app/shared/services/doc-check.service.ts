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
  private customerHmac: string = '';

  constructor(private httpClient: HttpClient) {}

  private initObserver() {
    const timestamp = new Date().toISOString()

    const interval = setInterval(async () => {
      try {
        const res = await this.getDocCheckStatus(timestamp).toPromise();
        if (['APROVACAO_MANUAL', 'APROVACAO_AUTOMATICA'].includes(res.Status)) {
          this.closeModal();
        }

        if (!['EM_VALIDACAO', 'REQUER_VALIDACAO_MANUAL', 'NOT_FOUND'].includes(res.Status)) {
          clearInterval(interval);
        }

        this.iframeMessageSubject.next({StatusPostMessage: res});
      } catch (error) {
        clearInterval(interval);
      }
    }, 3000);
  }

  private getDocCheckStatus(timestamp) {
    return this.httpClient.get(`https://api.exato.digital/doccheck/validation-identity/status?hash=${this.customerHmac}&session_start_timestamp=${timestamp}`)
      .pipe(
        take(1),
        map((res: any) => res)
      )
  }

  hmacHash(cpf, secret_key) {
    let hash = CryptoJS.HmacSHA256(cpf , secret_key);
    hash = hash.toString(CryptoJS.enc.Hex);
    this.customerHmac = hash;
    return hash;
  }
  
  init() {
    exDocCheck.init();
    this.initObserver();
  }

  closeModal() {
    document.getElementById('ex-doccheck-close').click();
  }
}

