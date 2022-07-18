import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CasinoGuard implements CanActivate {
  constructor(
      private auth: AuthService, private router: Router
  ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.auth.modalidadeHabilitada('casino')) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }

}
