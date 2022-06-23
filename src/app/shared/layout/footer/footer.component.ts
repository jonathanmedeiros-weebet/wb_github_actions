import { Component, OnInit } from '@angular/core';
import { config } from '../../config';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit {
    BANCA_NOME = '';
    LOGO = config.LOGO;
    isAppMobile;
    trevoOne = false;
    hasMpToken = false;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();

    constructor(
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.isAppMobile = this.authService.isAppMobile();
        this.BANCA_NOME = config.BANCA_NOME;
        this.hasMpToken = this.paramsLocais.getOpcoes().has_mp_token;

        if (location.host.search(/trevoone/) >= 0) {
            this.trevoOne = true;
        }
    }
}
