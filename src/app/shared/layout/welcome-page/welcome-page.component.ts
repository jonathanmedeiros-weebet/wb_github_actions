import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametrosLocaisService } from './../../services/parametros-locais.service';
import { config } from './../../../shared/config';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DepositoComponent} from 'src/app/clientes/deposito/deposito.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})

export class WelcomePageComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private params: ParametrosLocaisService
    ) {}

    get clientName() {
        const user = JSON.parse(localStorage.getItem('user') ?? '')
        return (Boolean(user) && Boolean(user?.nome)) ? user?.nome.split(" ")[0] : '';
    }

    get merchantName() {
        return this.params.getOpcoes().banca_nome;
    }

    get merchantLogo() {
        return `https://weebet.s3.amazonaws.com/${config.SLUG}/logos/logo_banca.png`;
    }

    get booleanPromoPrimeiroDepositoAtivo() {
        let promo = localStorage.getItem('promocaoPrimeiroDepositoAtivo');
        if(!Boolean(promo)) return false;
        return Boolean(JSON.parse(promo));
    }

    get isCasinoModule() {
        return this.params.getOpcoes().casino && !this.params.getOpcoes().esporte;
    }

    ngOnInit() {
        if (localStorage.getItem('permissionWelcomePage') !== null ) {
            localStorage.removeItem('permissionWelcomePage');
        }
    }

    async depositeAgora() {
        if (window.innerWidth < 1025) {
            this.modalService.open(DepositoComponent);
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/clientes/deposito']);
        }        
    }
}
