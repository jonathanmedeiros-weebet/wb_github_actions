import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Import our authentication service
import { AuthService } from './../auth/auth.service';
import { MessageService } from './../utils/message.service';

@Injectable({
    providedIn: 'root',
})
export class ExpiresGuard  {
    constructor(
        private auth: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.isExpired()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
