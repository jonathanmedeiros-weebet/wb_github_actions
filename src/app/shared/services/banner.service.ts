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

    private bannersSource = new BehaviorSubject<any[]>([]);
    public banners = this.bannersSource.asObservable();

    constructor(
        private http: HttpClient,
        private header: HeadersService,
        private errorService: ErrorService
    ) {}

    requestBanners(pagina = 'futebol') {
        if (!this.synchronized) {
            this.http.get(`${this.BannerUrl}`, this.header.getRequestOptions(false))
                .subscribe((res: any) => {
                        this.cachedBanners = res.results;
                        this.bannersSource.next(this.filterBanners(pagina));
                        this.synchronized = true;
                    },
                    error => {
                        catchError(this.errorService.handleError);
                    });
        } else {
            this.bannersSource.next(this.filterBanners(pagina));
        }
    }

    filterBanners(pagina) {
        return this.cachedBanners.filter(banner => ['todas', pagina.toString()].includes(banner.pagina));
    }
}
