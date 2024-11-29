import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {config} from '../../config';
import {HeadersService} from './headers.service';
import {catchError, map, take} from 'rxjs/operators';
import {ErrorService} from './error.service';

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
        } else if (userAgent.match( /Android/i)) {
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
}
