import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config';
import { HeadersService } from './headers.service';
import { catchError, map, take } from 'rxjs/operators';
import { ErrorService } from './error.service';

export enum MaskAnonymizationTypes {
    EMAIL = 'email',
    PHONE = 'phone'
}

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    utilsUrl = `${config.BASE_URL}/utils`;

    constructor(
        private http: HttpClient,
        private headers: HeadersService,
        private errorService: ErrorService
    ) {
    }

    getDateTime() {
        return this.http.get(`${this.utilsUrl}/current-datetime`, this.headers.getRequestOptions(true))
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getEstados() {
        return this.http.get(`${this.utilsUrl}/getEstados`, this.headers.getRequestOptions())
            .pipe(
                map((res: any) => res.results),
                catchError(() => [])
            );
    }

    getCidades(estado: number | string) {
        return this.http.get(`${this.utilsUrl}/getCidades/${estado}`, this.headers.getRequestOptions())
            .pipe(
                map((res: any) => res.results),
                catchError(() => [])
            );
    }

    getCountries() {
        return this.http.get('https://weebet.s3.us-east-1.amazonaws.com/cdn/json/countries.json')
            .pipe(
                map((response: any) => response),
                catchError(() => [])
            );
    }

    getEnderecoPorCep(cep: string | number) {
        return this.http.get(`https://viacep.com.br/ws/${cep}/json`);
    }

    getRegioesDestaque() {
        return this.http.get(`${this.utilsUrl}/regioes-destaque`, this.headers.getRequestOptions())
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }

    getMobileOperatingSystem() {
        const userAgent = navigator.userAgent;

        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'ios';
        } else if (userAgent.match(/Android/i)) {
            return 'android';
        }

        return 'unknown';
    }

    isToday(dateString: string | null): boolean {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    }

    timeStringToMilliseconds(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours * 60 + minutes) * 60 * 1000;
    }

    isValidDate(dateString: string | null): boolean {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }

    getBanks() {
        return this.http.get(`${this.utilsUrl}/getBanks`, this.headers.getRequestOptions())
            .pipe(
                map((res: any) =>
                    res.results
                        .map((item: any) => ({ ...item, nome: item.nome.toUpperCase() }))
                        .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
                ),
                catchError(() => [])
            );
    }

    applyMaskAnonymization(value: string, type: MaskAnonymizationTypes = MaskAnonymizationTypes.PHONE) {
        if (type == MaskAnonymizationTypes.PHONE) {
            value = value.replace(/\D/g, '');
            if (value.length < 2) return '(**)*******';
            const lastTwo = value.slice(-2);
            return `(**)*******${lastTwo}`;
        }

        if (type == MaskAnonymizationTypes.EMAIL) {
            if (value.includes('@')) {
                const [localPart, domain] = value.split('@');
                const maskedLocalPart = localPart.slice(0, 2) + '*******';
                return maskedLocalPart + '@' + domain;
            }
        }

        return value;
    }

    private getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const isMobileUA = /iphone|ipod|android.*mobile|windows phone/.test(userAgent);
        const isTabletUA = /ipad|android(?!.*mobile)|tablet/.test(userAgent);

        const width = window.innerWidth;
        if (isMobileUA || (isTouchDevice && width <= 767)) return 'mobile';
        if (isTabletUA || (isTouchDevice && width > 767 && width <= 1024)) return 'tablet';

        return 'desktop';
    }

    public isMobile() {
        return this.getDeviceType() == 'mobile';
    }

    public isTablet() {
        return this.getDeviceType() == 'tablet';
    }

    public isDesktop() {
        return this.getDeviceType() == 'desktop';
    }

    public isLandscape() {
        return (
            window.matchMedia("(orientation: landscape)").matches ||
            window.innerWidth > window.innerHeight
        );
    }
}
