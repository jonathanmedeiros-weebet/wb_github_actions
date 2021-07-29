import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import { ParametrosLocaisService, PrintService, 
    AuthService, UtilsService, 
    MessageService, ImagensService } from '../../../../services';
import * as moment from 'moment';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-exibir-bilhete-esportivo',
    templateUrl: 'exibir-bilhete-esportivo.component.html',
    styleUrls: ['exibir-bilhete-esportivo.component.css']
})

export class ExibirBilheteEsportivoComponent implements OnInit {
    @ViewChild('bilheteCompartilhamento', { static: false }) bilheteCompartilhamento;
    @Input() aposta: any;
    LOGO = config.LOGO;
    opcoes;
    cambistaPaga;
    appMobile;

    constructor(
        private paramsService: ParametrosLocaisService,
        private printService: PrintService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private auth: AuthService,
        private imagemService: ImagensService
    ) { }

    ngOnInit() {
        this.imagemService.buscarLogo().subscribe(
            imagem => {
                const logoFromServer = imagem;
                this.LOGO = `data:image/png;base64,${logoFromServer}`;  
            } 
        );
        this.appMobile = this.auth.isAppMobile();

        this.opcoes = this.paramsService.getOpcoes();

        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
        };
    }

    shared() {
        this.bilheteCompartilhamento.shared();
    }

    print() {
        this.utilsService.getDateTime().subscribe(
            results => {
                const { currentDateTime } = results;
                const dateTime = moment(currentDateTime).format('DD/MM/YYYY [as] HH:mm');
                this.printService.sportsTicket(this.aposta, dateTime);
            },
            error => {
                this.handleError(error);
            }
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
