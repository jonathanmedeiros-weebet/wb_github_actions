import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../../../services';
import { Usuario } from './../../../models';
import { config } from './../../config';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
    usuario = new Usuario();
    LOGO;

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.usuario = this.auth.getUsuario();
        this.LOGO = config.LOGO;
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/auth/login']);
    }
}
