import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DefaultUrlSerializer } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {

    constructor(private router: Router) {}
      
    canActivate(): boolean {

        const permission = localStorage.getItem('permissionWelcomePage');

        if (permission !== null && permission !== "") {
            const isAllowed = JSON.parse(permission);
            if (isAllowed) {
                return true;
            }
        }
        this.router.navigate(['/']);
        return false;
      }

}
