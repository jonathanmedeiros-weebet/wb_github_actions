import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { LogService } from './log.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor(private log: LogService) { }

    handleError(error: HttpErrorResponse) {
        let message = '';

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            message = `Um problema ocorreu: ${error.error.message}`;
            console.log(error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // console.error(`Backend returned code ${error.status}, ` + `body was: ${error.message}`);
            if (error.error.errors) {
                message = error.error.errors.message;
            } else {
                this.log.registrar(error)
                    .subscribe(() => console.log('sucesso ao registrar error.'));

                message = 'Ocorreu um problema inesperado, entre em contato com a banca.';
            }
        }
        // return an observable with a user-facing error message
        return throwError(message);
    }

}
