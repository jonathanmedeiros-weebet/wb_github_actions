import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../config';
import {
    ParametrosLocaisService, HelperService,
    AuthService, MessageService
} from '../../../services';
import * as html2canvas from 'html2canvas';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-bilhete-compartilhamento',
    templateUrl: 'bilhete-compartilhamento.component.html',
    styleUrls: ['bilhete-compartilhamento.component.css']
})

export class BilheteCompartilhamentoComponent implements OnInit {
    @ViewChild('bilhete', { static: false }) bilhete: ElementRef;
    @Input() aposta: any;
    LOGO;
    opcoes;
    cambistaPaga;
    appMobile;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private auth: AuthService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.LOGO = config.LOGO;
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
            const options = {
                logging: false
            };

            html2canvas(this.bilhete.nativeElement, options).then((canvas) => {
                this.helperService.sharedTicket(this.aposta, canvas.toDataURL());
            });
        } else {
            if (newNavigator.share) {
                newNavigator.share({
                    title: config.BANCA_NOME,
                    text: `${config.BANCA_NOME}: #${this.aposta.id}`,
                    url: `${location.origin}/bilhete/${this.aposta.chave}`,
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
