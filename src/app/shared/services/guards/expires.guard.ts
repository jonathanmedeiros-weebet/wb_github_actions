import { Injectable } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { MessageService } from './../utils/message.service';

@Injectable({
    providedIn: 'root',
})
export class ExpiresGuard implements CanActivateChild {
    constructor(
        private auth: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.isExpired()) {
            this.router.navigate(['/auth/login']);
            return false;
        }
        return true;
    }
}
