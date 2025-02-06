import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import {
    ParametrosLocaisService, PrintService,
    AuthService, UtilsService, MessageService
} from '../../../../services';
import * as moment from 'moment';
import { ApostaEsportiva, ItemApostaEsportiva} from '../../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompatilhamentoBilheteModal } from '../../modals';
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
    enabledBookie;
    appMobile;
    isCliente;
    isLoggedIn;
    modalCompartilhamentoRef;

    constructor(
        private paramsService: ParametrosLocaisService,
        private printService: PrintService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private auth: AuthService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.opcoes = this.paramsService.getOpcoes();
        this.enabledBookie = this.opcoes.modo_cambista;
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cliente
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );

        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }

        const itensOrdenados = this.ordenarApostaItensPorData(this.aposta);
        this.aposta.itens = itensOrdenados;
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
            'encerrado': item.encerrado
        };
    }

    shared() {
        if (this.appMobile) {
            this.modalCompartilhamentoRef = this.modalService.open(CompatilhamentoBilheteModal,{
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
                animation: true,
                backdrop: 'static',
            });
            this.modalCompartilhamentoRef.result.then(
                (result) => {
                    switch (result) {
                        case 'imagem':
                            this.bilheteCompartilhamento.shared(true);
                            break;
                        case 'link':
                        default:
                            this.bilheteCompartilhamento.shared(false);
                            break;
                    }
                },
                (reason) => { }
            );
        } else {
            this.bilheteCompartilhamento.shared(false);
        }
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

    private ordenarApostaItensPorData(aposta: ApostaEsportiva): Array<ItemApostaEsportiva> {
        let itensOrdenados;
        itensOrdenados = aposta.itens.sort((a,b) => moment(a.jogo_horario).toDate().getTime() - moment(b.jogo_horario).toDate().getTime());
        return itensOrdenados;
    }
}
