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

export class WelcomePageComponent {
    nomeCliente = '';
    SLUG;
    soCassino = false;
    validEmail;
    bancaNome;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private params: ParametrosLocaisService) {}

    ngOnInit() {
        this.SLUG = config.SLUG;
        this.bancaNome = this.params.getOpcoes().banca_nome;
        this.route.queryParams.subscribe(params => {
            this.nomeCliente = params['nomeCliente'];
            this.validEmail = params['valid'] === 'true';
        });

        if (localStorage.getItem('permissionWelcomePage') !== null ) {
            localStorage.removeItem('permissionWelcomePage');
        }

        if (this.params.getOpcoes().casino && !this.params.getOpcoes().esporte) {
            this.soCassino = true;
        }
    }

    depositeAgora() {
        if (window.innerWidth < 1025) {
            this.modalService.open(DepositoComponent);
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/clientes/deposito']).then(() => {
                window.location.reload();
            });
        }        
    }
}
