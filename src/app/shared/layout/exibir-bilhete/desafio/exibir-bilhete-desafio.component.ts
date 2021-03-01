import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from '../../../config';
import {
    ParametrosLocaisService, HelperService, PrintService,
    AuthService, MessageService
} from '../../../../services';
import * as html2canvas from 'html2canvas';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-exibir-bilhete-desafio',
    templateUrl: 'exibir-bilhete-desafio.component.html',
    styleUrls: ['exibir-bilhete-desafio.component.css']
})

export class ExibirBilheteDesafioComponent implements OnInit {
    @ViewChild('cupom', { static: false }) cupom: ElementRef;
    @Input() aposta: any;
    modalRef;
    LOGO = config.LOGO;
    opcoes;
    cambistaPaga;
    appMobile;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private printService: PrintService,
        private auth: AuthService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();

        this.opcoes = this.paramsService.getOpcoes();

        if (this.aposta.passador.percentualPremio > 0) {
            this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
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
            const options = { logging: false };

            html2canvas(this.cupom.nativeElement, options).then((canvas) => {
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

    print() {
        this.printService.desafioTicket(this.aposta);
    }
}
