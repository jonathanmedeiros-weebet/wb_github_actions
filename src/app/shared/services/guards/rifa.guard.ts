import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RifaGuard  {
    constructor(private auth: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!this.auth.modalidadeHabilitada('rifas') && !this.auth.modalidadeHabilitada('rifa')) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }

}
