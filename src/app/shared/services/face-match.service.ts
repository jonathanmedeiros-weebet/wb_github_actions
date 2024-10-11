import { LegitimuzFacialService } from './legitimuz-facial.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './utils/error.service';
import { HeadersService } from './utils/headers.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaceMatchService {
  private faceMatchUrl = `${config.BASE_URL}/facematch`;

  constructor(
    private http: HttpClient,
    private header: HeadersService,
    private errorService: ErrorService,
    private legitimuzService: LegitimuzService,
    private legitimuzFacialService: LegitimuzFacialService
  ) {
  }

  createFacematch(data: any): Observable<any> {
    return this.http.post(`${this.faceMatchUrl}/cadastro`, data)
      .pipe(
        map((res: any) => { return res.results }),
        catchError(this.errorService.handleError)
      );
  }

  updadeFacematch(data: any): Observable<any> {
    return this.http.post(`${this.faceMatchUrl}/update-facematch`, data)
      .pipe(
        map((res: any) => { return res.results }),
        catchError(this.errorService.handleError)
      );
  }

  getFaceMatch(data: any): Observable<any> {
    return this.http.post(`${this.faceMatchUrl}/facematch`, data)
      .pipe(
        map((res: any) => { console.log(res); return res.results }),
        catchError(this.errorService.handleError)
      );
  }

}
