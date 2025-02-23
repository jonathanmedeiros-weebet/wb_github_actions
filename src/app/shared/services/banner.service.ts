import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { HeadersService } from './utils/headers.service';
import { ErrorService } from './utils/error.service';
import { config } from '../config';

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    private BannerUrl = `${config.LOKI_URL}/banners`;

    synchronized = false;
    cachedBanners = [];

    private bannersSource = new BehaviorSubject<any[]>(undefined);
    public banners = this.bannersSource.asObservable();

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {}

    requestBanners() {
        if (!this.synchronized) {
            return this.http.get(`${this.BannerUrl}`, this.header.getRequestOptions(false))
                .pipe(
                    map((res: any) => {
                        this.cachedBanners = res.results;
                        this.bannersSource.next(this.cachedBanners);
                        this.synchronized = true;
                        return res.results
                    }),
                    catchError((error) => this.errorService.handleError(error))
                );
        } else {
            this.bannersSource.next(this.cachedBanners);
            return this.banners;
        }
    }
}
