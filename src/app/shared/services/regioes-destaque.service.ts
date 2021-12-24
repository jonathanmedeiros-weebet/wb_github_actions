import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {config} from '../config';
import {HeadersService} from './utils/headers.service';
import {catchError, map} from 'rxjs/operators';
import {ErrorService} from './utils/error.service';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegioesDestaqueService {
    regiaoDestaqueUrl = `${config.BASE_URL}/regioes-destaque`;
    private permitirDestaquesSource = new BehaviorSubject<boolean>(true);
    permitirDestaques = this.permitirDestaquesSource.asObservable();

    constructor(
        private http: HttpClient,
        private headers: HeadersService,
        private errorService: ErrorService
    ) {
    }

    setPermitirDestaques(bool){
        this.permitirDestaquesSource.next(bool);
    }

    getRegioesDestaque() {
        return this.http.get(`${this.regiaoDestaqueUrl}`, this.headers.getRequestOptions())
            .pipe(
                map((res: any) => res.results),
                catchError(this.errorService.handleError)
            );
    }
}
