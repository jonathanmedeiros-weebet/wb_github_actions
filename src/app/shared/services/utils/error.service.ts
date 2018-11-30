import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    handleError(error: HttpErrorResponse) {
        let message = '';

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            message = `An error occurred: ${error.error.message}`;
            console.error(message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // console.error(`Backend returned code ${error.status}, ` + `body was: ${error.message}`);

            message = error.error.errors.message;
        }
        // return an observable with a user-facing error message
        return throwError(message);
    }

}
