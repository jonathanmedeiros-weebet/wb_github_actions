import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    HelperService,
    AuthService,
    ParametrosLocaisService,
    MessageService,
    ApostaService,
    UtilsService,
    PrintService,
    BilheteEsportivoService
} from '../../../../services';
import { config } from '../../../config';
import * as moment from 'moment';
import { ApostaEsportivaService } from 'src/app/shared/services/aposta-esportiva/aposta-esportiva.service';
import { switchMap, takeUntil, delay, tap, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CompatilhamentoBilheteModal } from '../compartilhamento-bilhete-modal/compartilhamento-bilhete-modal.component';
import { JogoService } from 'src/app/shared/services/aposta-esportiva/jogo.service';
import * as sportsIds from '../../../constants/sports-ids';
import { Router } from '@angular/router';

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
    novaPossibilidadeGanho;
    itemSelecionado;
    itemSelecionadoAoVivo;
    falhaSimulacao;
    cambistaPaga;
    apostaVersion;
    showLoading = false;
    simulando = false;
    repeating = false;
    encerrando = false;
    isCliente;
    isMobile;
    urlBilheteAoVivo;
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
        private jogoService: JogoService,
        private router: Router,
        private bilheteEsportivo: BilheteEsportivoService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.isMobile = window.innerWidth <= 1024;
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.casaDasApostasId = this.paramsLocais.getOpcoes().casa_das_apostas_id;
        this.isCliente = this.auth.isCliente();
        this.origin = this.appMobile ? '?origin=app' : '';
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

    encerrarAposta(aposta) {
        this.simulando = true;
        this.itemSelecionado = aposta;
        this.apostaVersion = aposta.version;
        this.simularEncerramento(aposta);
    }

    jogoComecou(item) {
        const dateHoraAgora = new Date();
        const dataHoraAlvo = new Date(item.jogo_horario);

        if (dateHoraAgora > dataHoraAlvo) {
            return true;
        }

        return false;
    }

    simularEncerramento(aposta) {
        this.apostaService.simularEncerramento(aposta.id)
            .subscribe(
                simulacao => {
                    this.simulando = false;
                    this.novaPossibilidadeGanho = simulacao.nova_possibilidade_ganho;
                    this.falhaSimulacao = simulacao.falha_simulacao;
                },
                error => {
                    this.handleError(error);
                }
            );
        this.showLoading = false;
    }

    async confirmarEncerramento() {
        if (this.itemSelecionado != null) {
            const aovivo = await this.temAoVivo(this.itemSelecionado);
            if (aovivo) {
                this.setDelay();

                let token_aovivo = null;
                const aposta = this.itemSelecionado;
                const version = this.apostaVersion;

                this.process = true;
                this.apostaEsportivaService.tokenAoVivoEncerramento(this.itemSelecionado.id)
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
                            return this.apostaService.encerrarAposta({ token: token_aovivo, apostaId: aposta.id, version: version });
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
                            this.novaPossibilidadeGanho = null;
                            this.process = false;
                            this.handleError(error);
                        }
                    )
            } else {
                this.encerrando = true;
                this.apostaService.encerrarAposta({ apostaId: this.itemSelecionado.id, version: this.apostaVersion })
                    .subscribe(
                        result => {
                            this.messageService.success(result, 'Sucesso');
                            this.atualizarAposta(this.aposta);
                            this.descartar();
                            this.encerrando = false;
                        },
                        error => {
                            this.novaPossibilidadeGanho = null;
                            this.handleError(error);
                        }
                    );
            }
        }
        this.itemSelecionado = null;
        this.apostaVersion = null;
    }

    async temAoVivo(aposta: any): Promise<boolean> {
        let result = false;

        const found = aposta.itens.find((item: any) => item.ao_vivo);
        if (found) {
            return true;
        }

        const itensID = aposta.itens.map((item: any) => {
            return item.jogo_api_id;
        })

        const retorno = await this.jogoService.verficarAoVivo(itensID).toPromise();

        if (retorno) {
            result = true;
        }

        return result;
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
            this.modalCompartilhamentoRef = this.modalService.open(CompatilhamentoBilheteModal, {
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

    async shareBetLink(aposta) {
        if (navigator.share) {
            navigator.share({
                title: 'Bilhete de Aposta',
                text: 'Acesse o link para visualizar o bilhete de aposta.',
                url: `https://${config.SLUG}/compartilhar-bilhete/${aposta.codigo}`
            }).then(() => {
                this.messageService.success('Bilhete compartilhado com sucesso!');
            });
        } else {
            this.copyToClipboard(`https://${config.SLUG}/compartilhar-bilhete/${aposta.codigo}`, false);
            this.messageService.success('Link copiado para a área de transferência!');
        }
    }

    public async convertItemToBet(itens) {
        try {
            return await this.jogoService.convertItemToBet(itens);
        } catch (error) {
            this.handleError(error.message);
            return [];
        }
    }


    async repetirAposta(aposta) {
        this.repeating = true;
        let convertedItemToBet = await this.convertItemToBet(aposta.itens);
        if (convertedItemToBet.length) {
            this.bilheteEsportivo.atualizarItens(convertedItemToBet);
            this.activeModal.close();
            this.router.navigate(['/esportes']);
            this.messageService.success('Aposta repetida com sucesso!');
            return;
        }
        this.messageService.warning('A aposta não pôde ser repetida.');
        this.repeating = false;
    }

    async copyToClipboard(codigo: string, message = true) {
        try {
            await navigator.clipboard.writeText(codigo);
            if (message) {
                this.messageService.success('Código copiado para a área de transferência!');
            }
        } catch (err) {
            this.messageService.error('Falha ao copiar o código para a área de transferência.');
        }
    }

    sportIcon(sportId) {
        let className = 'icon-futebol wbicon';

        switch (sportId) {
            case sportsIds.FOOTBALL_ID: {
                className = 'wbicon icon-futebol';
                break;
            }
            case sportsIds.BOXING_ID: {
                className = 'wbicon icon-luta';
                break;
            }
            case sportsIds.AMERICAN_FOOTBALL_ID: {
                className = 'wbicon icon-futebol-americano';
                break;
            }
            case sportsIds.TENNIS_ID: {
                className = 'wbicon icon-tenis';
                break;
            }
            case sportsIds.ICE_HOCKEY_ID: {
                className = 'wbicon icon-hoquei-no-gelo';
                break;
            }
            case sportsIds.BASKETBALL_ID: {
                className = 'wbicon icon-basquete';
                break;
            }
            case sportsIds.FUTSAL_ID: {
                className = 'wbicon icon-futsal';
                break;
            }
            case sportsIds.VOLLEYBALL_ID: {
                className = 'wbicon icon-volei';
                break;
            }
            case sportsIds.E_SPORTS_ID: {
                className = 'wbicon icon-e-sports';
                break;
            }
        }

        return className;
    }

    podeEncerrar(aposta) {
        const strategy = this.paramsLocais.getOpcoes().closure_strategy;

        if (strategy === 'probability') {
            const itemSemProbabilidade = aposta.itens.find((item: any) => item.probabilidade == null);

            if (itemSemProbabilidade || (new Date(aposta.horario) < new Date('2024-05-08 13:00:00'))) {
                return false;
            }
        }

        const found = aposta.itens.find((item: any) => !item.encerrado && !item.resultado && !item.cancelado);
        if (!found) {
            return false;
        }

        if (aposta.resultado) {
            return false;
        }

        if (this.encerrando) {
            return false;
        }

        if (this.itemSelecionado && !this.simulando) {
            return false;
        }

        if (this.process) {
            return false;
        }

        return true;
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
