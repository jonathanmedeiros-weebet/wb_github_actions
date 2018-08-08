import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

@Injectable()
export class ErrorService {

    /*  handleError<T>(operation = 'operation', result?: T) {
          return (error: any): Observable<T> => {

              // TODO: send the error to remote logging infrastructure
              console.error(error); // log to console instead
              console.error('error.errors'); // log to console instead
              console.error(error.errors); // log to console instead

              // TODO: better job of transforming error for user consumption
              console.log(`${operation} failed: ${error.message}`);

              // Let the app keep running by returning an empty result.
              return of(result as T);
          };
          // console.log('q');
          // console.log(error);
          // if (error.error instanceof ErrorEvent) {
          //     // A client-side or network error occurred. Handle it accordingly.
          //     console.error('An error occurred:', error.error.message);
          // } else {
          //     // The backend returned an unsuccessful response code.
          //     // The response body may contain clues as to what went wrong,
          //     console.error(`Backend returned code ${error.status}, body was:`);
          // }
          // // return an ErrorObservable with a user-facing error message
          // return new ErrorObservable(error.error.errors.message);
      };
  */

    handleError(error: HttpErrorResponse) {
        let message = '';
        console.log(error);

        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            message = `An error occurred: ${error.error.message}`;
            console.error(message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.message}`);

            message = error.error.message;
        }
        // return an observable with a user-facing error message
        return throwError(message);
    }

}
