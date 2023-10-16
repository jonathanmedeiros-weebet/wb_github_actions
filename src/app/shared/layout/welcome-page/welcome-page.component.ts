import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
    nomeCliente = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.nomeCliente = params['nomeCliente'];
        });

        if (localStorage.getItem('permissionWelcomePage') !== null ) {
            localStorage.removeItem('permissionWelcomePage');
        }
    }
}
