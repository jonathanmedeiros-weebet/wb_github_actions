import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from '../../config';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class RodadaGratisService {
	private rodadaGratisUrl = `${config.BASE_URL}/rodadagratis`;

	constructor(
		private http: HttpClient,
		private errorService: ErrorService,
		private header: HeadersService
	) { }
    
	redeemCommission(freeRoundId: number): Observable<any> {
		return this.http.post(`${this.rodadaGratisUrl}/resgatar-premio`,
			{freeRoundId: freeRoundId},
			this.header.getRequestOptions(true))
			.pipe(
				map((res: any) => res.results),
				catchError(this.errorService.handleError)
			);
	}
}
