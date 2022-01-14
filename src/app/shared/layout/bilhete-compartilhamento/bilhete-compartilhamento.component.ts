import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../config';
import {
    ParametrosLocaisService, HelperService,
    AuthService, MessageService, ImagensService
} from '../../../services';

import { toPng } from 'html-to-image';

let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-bilhete-compartilhamento',
    templateUrl: 'bilhete-compartilhamento.component.html',
    styleUrls: ['bilhete-compartilhamento.component.css']
})

export class BilheteCompartilhamentoComponent implements OnInit {
    @ViewChild('bilhete', { static: true }) bilhete: ElementRef;
    @Input() aposta: any;
    opcoes;
    cambistaPaga;
    appMobile;
    LOGO;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private auth: AuthService,
        private messageService: MessageService,
        private imagensService: ImagensService
    ) {
        this.LOGO = this.imagensService.logo;
    }

    ngOnInit() {
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
        if (this.appMobile) {
            toPng(this.bilhete.nativeElement).then((dataUrl) => {
                this.helperService.sharedTicket(this.aposta, dataUrl);
            });
        } else {
            if (newNavigator.share) {
                newNavigator.share({
                    title: config.BANCA_NOME,
                    text: `${config.BANCA_NOME}: ${this.aposta.codigo}`,
                    url: `${location.origin}/bilhete/${this.aposta.codigo}`,
                });
            } else {
                this.messageService.error('Compartilhamento não suportado pelo seu navegador');
            }
        }
    }

    getItemClass(index) {
        return {
            'item-even': (index % 2),
            'item-odd': !(index % 2)
        };
    }
}
