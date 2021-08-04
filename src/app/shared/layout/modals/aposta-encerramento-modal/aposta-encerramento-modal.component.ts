import {Component, OnInit, Input, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HelperService, AuthService, ParametrosLocaisService, MessageService, ApostaService} from '../../../../services';
import {config} from '../../../config';

@Component({
    selector: 'app-aposta-encerramento-modal',
    templateUrl: './aposta-encerramento-modal.component.html',
    styleUrls: ['./aposta-encerramento-modal.component.css']
})
export class ApostaEncerramentoModalComponent implements OnInit {
    LOGO = config.LOGO;
    aposta;
    appMobile;
    casaDasApostasId;
    isLoggedIn;
    opcoes;
    novaCotacao;
    novaPossibilidadeGanho;
    itemSelecionado;
    falhaSimulacao;
    cambistaPaga;
    showLoading = false;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private messageService: MessageService,
        private apostaService: ApostaService,
        private auth: AuthService
    ) {
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.casaDasApostasId = this.paramsLocais.getOpcoes().casa_das_apostas_id;

        this.opcoes = this.paramsLocais.getOpcoes();

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

    encerramentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (opcoes.permitir_encerrar_aposta) {
            result = true;
        }

        return result;
    }

    addEncerramento(item) {
        if (!this.jogoComecou(item)) {
            this.itemSelecionado = item.id;
            this.simularEncerramento(this.itemSelecionado);
        }
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
        this.showLoading = true;
        this.apostaService.simularEncerramento(itensSimulacao)
            .subscribe(
                simulacao => {
                    this.novaCotacao = simulacao.nova_cotacao;
                    this.novaPossibilidadeGanho = simulacao.nova_possibilidade_ganho;
                    this.falhaSimulacao = simulacao.falha_simulacao;
                },
                error => {
                    this.handleError(error);
                }
            );
        this.showLoading = false;
    }

    confirmarEncerramento() {
        if (this.itemSelecionado != null) {
            this.apostaService.encerrarItem(this.itemSelecionado)
                .subscribe(
                    result => {
                        this.messageService.success(result, 'Sucesso');
                        this.atualizarAposta(this.aposta);
                        this.descartar();
                    },
                    error => {
                        this.handleError(error);
                    }
                );
        }

        this.itemSelecionado = null;
    }

    atualizarAposta(aposta) {
        this.apostaService.getAposta(aposta.id)
            .subscribe(
                apostaAtualizada => {
                    this.aposta = apostaAtualizada;
                },
                error => {}
            );
    }

    descartar() {
        this.itemSelecionado = null;
        this.falhaSimulacao = null;
        this.novaCotacao = null;
        this.novaPossibilidadeGanho = null;
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
