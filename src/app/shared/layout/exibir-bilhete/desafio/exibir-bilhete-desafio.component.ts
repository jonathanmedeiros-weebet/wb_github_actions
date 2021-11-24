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
    isCambista;
    isLoggedIn;

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
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cambista
            .subscribe(
                isCambista => {
                    this.isCambista = isCambista;
                }
            );

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
            const options = { logging: false, useCORS: true };

            html2canvas(this.cupom.nativeElement, options).then((canvas) => {
                this.helperService.sharedTicket(this.aposta, canvas.toDataURL());
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

    print() {
        this.printService.desafioTicket(this.aposta);
    }
}
