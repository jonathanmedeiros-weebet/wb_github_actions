import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor() { }

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
                message = 'Ocorreu um problema inesperado, entre em contato com a banca.';
            }
        }

        let result;

        if (error.error.errors && error.error.errors.code) {
            result = error.error.errors;
        } else {
            result = message;
        }

        // return an observable with a user-facing error message
        return throwError(result);
    }

    handleErrorLogin(error: HttpErrorResponse) {
        const array = [];

        array['code'] = error.error.errors.code;
        array['message'] = error.error.errors.message;
        if (error.error.errors.user){
            array['user'] = error.error.errors.user;
        }else{
            array['user'] = null;
        }
        // return an observable with a user-facing error message
        return throwError(array);
    }

}
