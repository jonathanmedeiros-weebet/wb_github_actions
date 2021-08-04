import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import {ParametrosLocaisService, PrintService, AuthService, UtilsService, MessageService, ApostaService} from '../../../../services';
import * as moment from 'moment';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-exibir-bilhete-esportivo-edicao',
    templateUrl: 'exibir-bilhete-esportivo-edicao.component.html',
    styleUrls: ['exibir-bilhete-esportivo-edicao.component.css']
})

export class ExibirBilheteEsportivoEdicaoComponent implements OnInit {
    @ViewChild('bilheteCompartilhamento', { static: false }) bilheteCompartilhamento;
    @Input() aposta: any;
    LOGO = config.LOGO;
    opcoes;
    cambistaPaga;
    appMobile;
    itensSelecionados = [];
    dateTimeAtual;
    novaCotacao;
    novaPossibilidadeGanho;

    constructor(
        private paramsService: ParametrosLocaisService,
        private printService: PrintService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private auth: AuthService,
        private apostaService: ApostaService
    ) { }

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

    addEncerramento(item) {
        const indexItem = this.itensSelecionados.indexOf(item.id);
        if (this.itensSelecionados[indexItem]) {
            this.itensSelecionados.splice(indexItem, 1);
        } else {
            if (!this.jogoComecou(item)) {
                this.itensSelecionados.push(item.id);
            }
        }

        this.simularEncerramento(this.itensSelecionados);
    }

    jogoComecou(item) {
        const dateHoraAgora = new Date();
        const dataHoraAlvo = new Date(item.jogo_horario);

        if (dateHoraAgora > dataHoraAlvo) {
            return true;
        }

        return false;
    }

    simularEncerramento(itensSimulacao) {
        this.apostaService.simularEncerramento(itensSimulacao)
            .subscribe(
                simulacao => {
                    this.novaCotacao = simulacao.nova_cotacao ;
                    this.novaPossibilidadeGanho = simulacao.nova_possibilidade_ganho ;
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    confirmarEncerramentos() {
        if (this.itensSelecionados != null) {
            this.apostaService.encerrarItem(this.itensSelecionados)
                .subscribe(
                    result => {
                        this.messageService.success(result, 'Sucesso');
                    },
                    error => {
                        this.handleError(error);
                    }
                );
        }

        console.log('encerrado');
        // this.itensSelecionados = [];
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
