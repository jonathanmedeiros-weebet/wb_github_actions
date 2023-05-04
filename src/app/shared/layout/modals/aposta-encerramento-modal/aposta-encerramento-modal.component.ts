import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    HelperService,
    AuthService,
    ParametrosLocaisService,
    MessageService,
    ApostaService,
    UtilsService,
    PrintService
} from '../../../../services';
import { config } from '../../../config';
import * as moment from 'moment';
import { ApostaEsportivaService } from 'src/app/shared/services/aposta-esportiva/aposta-esportiva.service';
import { switchMap, takeUntil, delay, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CompatilhamentoBilheteModal } from '../compartilhamento-bilhete-modal/compartilhamento-bilhete-modal.component';

@Component({
    selector: 'app-aposta-encerramento-modal',
    templateUrl: './aposta-encerramento-modal.component.html',
    styleUrls: ['./aposta-encerramento-modal.component.css']
})
export class ApostaEncerramentoModalComponent implements OnInit, OnDestroy {
    LOGO = config.LOGO;
    @Input() primeiraImpressao = false;
    @Input() isUltimaAposta = false;
    @Input() showCancel = false;
    @ViewChild('bilheteCompartilhamento', { static: false }) bilheteCompartilhamento;
    @Input() aposta;
    appMobile;
    casaDasApostasId;
    isLoggedIn;
    opcoes;
    novaCotacao;
    novaPossibilidadeGanho;
    itemSelecionado;
    itemSelecionadoAoVivo;
    falhaSimulacao;
    cambistaPaga;
    apostaVersion;
    showLoading = false;
    isCliente;
    isMobile;
    urlBilheteAoVivo ;
    origin;
    process = false;
    delay = 0;
    delayReal = 0;
    apostaAoVivo = false;
    refreshIntervalId: any;
    unsub$ = new Subject();
    modalCompartilhamentoRef;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private messageService: MessageService,
        private apostaService: ApostaService,
        private apostaEsportivaService: ApostaEsportivaService,
        private utilsService: UtilsService,
        private printService: PrintService,
        private auth: AuthService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.isMobile = window.innerWidth <=1024;
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.casaDasApostasId = this.paramsLocais.getOpcoes().casa_das_apostas_id;
        this.isCliente = this.auth.isCliente();
        this.origin = this.appMobile ? '?origin=app':'';
        this.urlBilheteAoVivo = `https://${config.SLUG}/bilhete/${this.aposta.codigo}${this.origin}`;

        this.opcoes = this.paramsLocais.getOpcoes();

        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }

        this.setDelay();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    setDelay() {
        this.delay = this.opcoes.delay_aposta_aovivo ? this.opcoes.delay_aposta_aovivo : 10;

        if (this.delay < 10) {
            this.delayReal = 10;
        } else {
            this.delayReal = this.delay;
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

    addEncerramento(item, apostaVersion) {
        // if (!this.jogoComecou(item) || (this.jogoComecou(item) && item.ao_vivo)) {
            this.itemSelecionadoAoVivo = item.ao_vivo;
            this.itemSelecionado = item.id;
            this.apostaVersion = apostaVersion;
            this.apostaAoVivo = this.itemSelecionadoAoVivo;
            this.simularEncerramento(this.itemSelecionado);
        // }
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
            if(this.itemSelecionadoAoVivo) {
                this.setDelay();

                let token_aovivo = null;
                const item = this.itemSelecionado;
                const version = this.apostaVersion;

                this.process = true;
                this.apostaEsportivaService.tokenAoVivoEncerramento(this.itemSelecionado)
                    .pipe(
                        tap(token => {
                            this.refreshIntervalId = setInterval(() => {
                                if (this.delay > 0) {
                                    this.delay--;
                                }
                            }, 1000);

                            token_aovivo = token;
                        }),
                        delay(this.delayReal * 1000),
                        switchMap(() => {
                            return this.apostaService.encerrarItem({token: token_aovivo, itemId: item, version: version});
                        }),
                        takeUntil(this.unsub$)
                    )
                    .subscribe(
                        resp => {
                            this.messageService.success(resp, 'Sucesso');
                            this.atualizarAposta(this.aposta);
                            this.descartar();

                            this.process = false;
                        }, error => {
                            this.novaCotacao = null;
                            this.novaPossibilidadeGanho = null;
                            this.process = false;
                            this.handleError(error);
                        }
                    )
            } else {
                this.apostaService.encerrarItem({ itemId: this.itemSelecionado, version: this.apostaVersion })
                    .subscribe(
                        result => {
                            this.messageService.success(result, 'Sucesso');
                            this.atualizarAposta(this.aposta);
                            this.descartar();
                        },
                        error => {
                            this.novaCotacao = null;
                            this.novaPossibilidadeGanho = null;
                            this.handleError(error);
                        }
                    );
            }
        }
        this.itemSelecionado = null;
        this.apostaVersion = null;
    }

    atualizarAposta(aposta) {
        this.apostaService.getAposta(aposta.id)
            .subscribe(
                apostaAtualizada => {
                    this.aposta = apostaAtualizada;
                },
                error => { }
            );
    }

    descartar() {
        this.itemSelecionado = null;
        this.falhaSimulacao = null;
        this.novaCotacao = null;
        this.novaPossibilidadeGanho = null;
    }

    quantidadeMinimaBilhete() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;
        if (this.aposta.itens_ativos > opcoes.quantidade_min_jogos_bilhete) {
            result = true;
        }
        return result;
    }

    impressaoPermitida() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.primeiraImpressao) {
            result = true;
        } else {
            if (opcoes.permitir_reimprimir_aposta) {
                result = true;
            }

            if (opcoes.permitir_reimprimir_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
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

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
        this.activeModal.close('pagamento');
    }

    pagamentoPermitido() {
        return this.aposta.resultado && this.aposta.resultado === 'ganhou' && !this.aposta.pago && !this.aposta.cartao_aposta && !this.isCliente && this.isLoggedIn;
    }

    compartilhamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();

        return opcoes.habilitar_compartilhamento_comprovante;
    }

    cancelamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.showCancel && this.isLoggedIn && !this.isCliente) {
            if (opcoes.habilitar_cancelar_aposta) {
                result = true;
            } else if (opcoes.habilitar_cancelar_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
    }

    podeEncerrar(item, aposta, itemSelecionado) {
        if(itemSelecionado != null) {
            return false;
        }

        if(item.removido || item.resultado != null || item.encerrado) {
            return false;
        }

        if(aposta.resultado) {
            return false;
        }

        // if(this.jogoComecou(item) && !item.ao_vivo) {
        //     return false;
        // }

        if(!this.quantidadeMinimaBilhete()) {
            return false;
        }

        if(this.process) {
            return false;
        }

        return true;
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
