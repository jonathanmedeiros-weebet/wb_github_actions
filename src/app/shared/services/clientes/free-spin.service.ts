import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from '../../config';
import { ErrorService } from '../utils/error.service';
import { HeadersService } from '../utils/headers.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class FreeSpinService {
	private freeSpinUrl = `${config.BASE_URL}/freeround`;

	constructor(
		private http: HttpClient,
		private errorService: ErrorService,
		private header: HeadersService
	) { }

	redeemPrize(freeRoundId: string): Observable<any> {
		return this.http.post(`${this.freeSpinUrl}/redeem-prize`,
			{freeRoundId: freeRoundId},
			this.header.getRequestOptions(true))
			.pipe(
				map((res: any) => res.results),
				catchError(this.errorService.handleError)
			);
	}
}
