import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from '../../config';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class IndiqueGanheService {
	private indiqueGanheUrl = `${config.BASE_URL}/indiqueganhe`;

	constructor(
		private http: HttpClient,
		private errorService: ErrorService,
		private header: HeadersService
	) { }

	getIndicacoes(queryParams?: any): Observable<any> {
		let requestOptions;

		if (queryParams) {
			requestOptions = this.header.getRequestOptions(true, queryParams);
		} else {
			requestOptions = this.header.getRequestOptions(true);
		}

		return this.http.get(`${this.indiqueGanheUrl}/indicacoes`, requestOptions)
			.pipe(
				map((res: any) => res.results),
				catchError(this.errorService.handleError)
			);
	}

	redeemCommission(queryParams?: any): Observable<any> {
		let requestOptions;

		if (queryParams) {
			requestOptions = this.header.getRequestOptions(true, queryParams);
		} else {
			requestOptions = this.header.getRequestOptions(true);
		}

		return this.http.get(`${this.indiqueGanheUrl}/resgatar-saldo`, requestOptions)
			.pipe(
				map((res: any) => res.results),
				catchError(this.errorService.handleError)
			);
	}
}
