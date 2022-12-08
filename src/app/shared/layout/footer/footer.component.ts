import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from '../../config';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import { ResultadosModalComponent } from '../modals/resultados-modal/resultados-modal.component';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() container;
    BANCA_NOME = '';
    LOGO = config.LOGO;
    isAppMobile;
    trevoOne = false;
    hasMpToken = false;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    rodape;

    constructor(
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        this.isAppMobile = this.authService.isAppMobile();
        this.BANCA_NOME = config.BANCA_NOME;
        this.hasMpToken = this.paramsLocais.getOpcoes().has_mp_token;
        this.rodape = this.paramsLocais.getOpcoes().rodape;

        if (location.host.search(/trevoone/) >= 0) {
            this.trevoOne = true;
        }
    }

    abrirResultados() {
        this.modalService.open(ResultadosModalComponent, {
            centered: true,
            size: 'xl',
        });
    }
}
