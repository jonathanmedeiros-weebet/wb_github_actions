import { ChangeDetectorRef,Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Subject, Observable, of } from 'rxjs';
import { takeUntil, switchMap, delay, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { PreApostaModalComponent, ApostaModalComponent, LoginModalComponent } from '../../shared/layout/modals';
import {
    ApostaEsportivaService,
    AuthService,
    BilheteEsportivoService,
    HelperService,
    LayoutService,
    MenuFooterService,
    MessageService,
    ParametrosLocaisService,
    PreApostaEsportivaService,
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as clone from 'clone';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { SOCCER_ID } from '../../shared/constants/sports-ids';

@Component({
    selector: 'app-bilhete-esportivo',
    templateUrl: 'bilhete-esportivo.component.html',
    styleUrls: ['bilhete-esportivo.component.css'],
})
export class BilheteEsportivoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('apostaDeslogadoModal', { static: false }) apostaDeslogadoModal;
    @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
    mudancas = false;
    modalRef;
    possibilidadeGanho = 0;
    cotacao = 0;
    opcoes;
    apostaMinima;
    apostaMaximo;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText;
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: UntypedFormGroup;
    apostaAoVivo = false;
    delay = 10;
    delayReal = 10;
    cotacoesAlteradas = [];
    refreshIntervalId;
    unsub$ = new Subject();
    isCliente;
    isEsporte: boolean;
    isPagina: boolean;
    posicaoFinanceira = {
        saldo: 0,
        credito: 0,
        bonus: 0,
        bonusModalidade: 'nenhum'
    };
    mobileScreen = false;
    utilizarBonus = false;
    valorFocado = false;
    liveTrackerUrl;
    liveStreamUrl;
    modoCambista = false;
    showCampinho = true;
    showStream = false;
    showFrame = true;
    headerHeight = 92;
    soccerId = SOCCER_ID;

    constructor(
        public sanitizer: DomSanitizer,
        private apostaEsportivaService: ApostaEsportivaService,
        private preApostaService: PreApostaEsportivaService,
        private auth: AuthService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: UntypedFormBuilder,
        private modalService: NgbModal,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private menuFooterService: MenuFooterService,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService
    ) {
        super();
    }

    ngOnInit() {
        this.modoCambista = this.paramsService.getOpcoes().modo_cambista;
        this.mobileScreen = window.innerWidth <= 1024;
        const { habilitar_live_tracker, habilitar_live_stream } = this.paramsService.getOpcoes();

        this.createForm();
        this.definirAltura();
        this.opcoes = this.paramsService.getOpcoes();
        this.apostaMinima = this.opcoes.valor_min_aposta;
        this.apostaMaximo = this.opcoes.valor_max_aposta;
        this.setDelay();

        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                    if (isLoggedIn) {
                        this.auth.cliente
                            .subscribe(
                                isCliente => {
                                    this.isCliente = isCliente;
                                    if (isCliente && this.isLoggedIn) {
                                        this.form.patchValue({ apostador: 'cliente' });
                                        this.getPosicaoFinanceira();
                                    }
                                }
                            );
                    }
                }
            );

        this.mudancas = (localStorage.getItem('mudancas') === 'true');

        this.menuFooterService.isPagina
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => {
                    this.isPagina = res;
                }
            );

        this.menuFooterService.isEsporte
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => {
                    this.isEsporte = res;
                    if (this.isEsporte) {
                        const itens = this.bilheteService.getItens();
                        if (itens) {
                            this.bilheteService.atualizarItens(itens);
                        }
                    }
                }
            );

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(result => {
                this.setItens(result);
                this.calcularPossibilidadeGanho(this.form.value.valor);
                this.scrollToBottom();
            });

        this.bilheteService.idJogo
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                (response: any) => {
                    if (response) {
                        if(habilitar_live_stream) {
                            this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://stream.raysports.live/br/football?token=5oq66hkn0cwunq7&uuid=' + response);
                            this.showStreamFrame();
                        }

                        if(habilitar_live_tracker) {
                            this.liveTrackerUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://widgets-v2.thesports01.com/br/pro/football?profile=5oq66hkn0cwunq7&uuid=' + response);
                            this.showCampinhoFrame();
                        }
                    } else {
                        this.liveTrackerUrl = null;
                        this.liveStreamUrl = null;
                    }
                },
                error => this.handleError(error)
            );

        this.form.get('valor').valueChanges
            .pipe(takeUntil(this.unsub$))
            .subscribe(valor => {
                this.calcularPossibilidadeGanho(valor);
            });

        this.menuFooterService.toggleBilheteStatus
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.displayPreTicker = res
            );

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    private scrollToBottom(): void {
        if (this.scrollFrame) {
            const el = this.scrollFrame.nativeElement;

            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    definirAltura() {
        const altura = window.innerHeight - this.headerHeight;
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    showCampinhoFrame() {
        this.showFrame = true;
        this.showCampinho = true;
        this.showStream = false;
    }

    showStreamFrame() {
        this.showFrame = true;
        this.showStream = true;
        this.showCampinho = false;
    }

    toggleFrame() {
        this.showFrame = !this.showFrame;
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', (this.isCliente || !this.modoCambista) ? '' : [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima), Validators.max(this.apostaMaximo)]],
            itens: this.fb.array([]),
            aceitar_alteracoes_odds: [false],
            utilizar_bonus: [false]
        });

        this.cartaoApostaForm = this.fb.group({
            chave: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
            manter_cartao: [null]
        });
    }

    definirValor(valor) {
        this.form.patchValue({ 'valor': valor });
    }

    get itens() {
        return this.form.get('itens') as UntypedFormArray;
    }

    setItens(itens: ItemBilheteEsportivo[]) {
        const controls = itens.map(item => this.fb.control(item));
        const formArray = this.fb.array(controls);
        this.form.setControl('itens', formArray);
    }

    removerItem(index) {
        this.itens.removeAt(index);

        if (this.itens.length === 0) {
            this.aceitarMudancas();
        }

        this.bilheteService.atualizarItens(this.itens.value);
    }

    removerItens() {
        this.itens.clear();
        this.bilheteService.atualizarItens(this.itens.value);
    }

    calcularPossibilidadeGanho(valor) {
        let cotacao = 1;
        let aovivo = false;


        this.itens.value.forEach(item => {
            if (item.ao_vivo) {
                aovivo = true;
            }

            cotacao = cotacao * this.helperService.calcularCotacao(
                item.cotacao.valor,
                item.cotacao.chave,
                item.jogo.event_id,
                item.jogo.favorito,
                item.ao_vivo
            );
        });

        this.apostaAoVivo = aovivo;

        // Fator Máximo
        if (cotacao > this.opcoes.fator_max) {
            cotacao = this.opcoes.fator_max;
        }

        // Valor Máximo de Prêmio
        const premio = valor * cotacao;
        this.possibilidadeGanho = premio < this.opcoes.valor_max_premio ? premio : this.opcoes.valor_max_premio;

        if (this.itens.value.length == 0) {
            this.cotacao = 0;
        } else {
            this.cotacao = cotacao;
        }
    }

    toggleUtilizarBonus() {
        this.utilizarBonus = !this.utilizarBonus;
        this.calcularPossibilidadeGanho(this.form.value.valor);
    }

    setFocoValor(focus: boolean) {
        this.valorFocado = focus;
    }

    abrirLogin() {
        const options = {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-550 modal-h-350 modal-login',
            centered: true,
        };

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }

    submit() {
        if (!this.isCliente && !this.modoCambista) {
            this.abrirLogin();
        } else {
            this.disabledSubmit();

            let valido = true;
            let msg = '';

            if (!this.itens.length) {
                valido = false;
                msg = 'Por favor, inclua um evento.';
            }

            if (this.itens.length < this.paramsService.quantidadeMinEventosBilhete()) {
                valido = false;
                msg = `Por favor, inclua no MÍNIMO ${this.paramsService.quantidadeMinEventosBilhete()} evento(s).`;
            }

            if (this.itens.length > this.paramsService.quantidadeMaxEventosBilhete()) {
                valido = false;
                msg = `Por favor, inclua no MÁXIMO ${this.paramsService.quantidadeMaxEventosBilhete()} eventos.`;
            }

            if (valido) {
                if (this.isLoggedIn) {
                    const values = this.ajustarDadosParaEnvio();
                    this.salvarAposta(values);
                } else {
                    this.enableSubmit();

                    const cartaoChave = localStorage.getItem('cartao_chave');
                    if (cartaoChave) {
                        this.cartaoApostaForm.patchValue({
                            chave: cartaoChave,
                            manter_cartao: true
                        });
                    }

                    this.modalRef = this.modalService.open(
                        this.apostaDeslogadoModal,
                        {
                            ariaLabelledBy: 'modal-basic-title',
                            centered: true
                        }
                    );

                    this.modalRef.result
                        .then(
                            result => {
                            },
                            reason => {
                            }
                        );
                }
            } else {
                this.enableSubmit();
                this.messageService.warning(msg);
            }
        }
    }

    apostaSuccess(aposta) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.closeCupom();
        this.enableSubmit();
        this.trocarTipoApostaDeslogado('preaposta');

        this.bilheteService.atualizarItens([]);
        this.form.reset();
        this.utilizarBonus = false;
        this.cartaoApostaForm.reset();
        this.stopDelayInterval();

        if (this.isCliente) {
            this.form.patchValue({ 'apostador': 'cliente' });
            this.getPosicaoFinanceira();
        }

        let size = aposta.tipo == 'esportes' ? 'lg' : '';
        let typeWindow = aposta.tipo == 'esportes'? 'modal-700' : '';

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            scrollable: true,
            size: size,
            windowClass: typeWindow
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;
        this.menuFooterService.atualizarQuantidade(0);
    }

    preApostaSuccess(id) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.closeCupom();
        this.enableSubmit();

        this.bilheteService.atualizarItens([]);
        this.form.reset();
        this.cartaoApostaForm.reset();

        this.modalRef = this.modalService.open(PreApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.codigo = id;
        this.menuFooterService.atualizarQuantidade(0);
    }

    handleError(error) {
        this.enableSubmit();
        this.stopDelayInterval();

        if (typeof error === 'string') {
            this.messageService.error(error);
        } else {
            if (error.code === 17) {
                error.data.forEach(item => {
                    this.itens.value.forEach(i => {
                        if (item.jogo_event_id == i.jogo_event_id) {
                            i.cotacao_antiga_valor = i.cotacao.valor;
                            i.cotacao.valor = item.valor;
                            i.mudanca = true;
                        }
                    });
                });

                localStorage.setItem('mudancas', 'true');
                this.bilheteService.atualizarItens(this.itens.value);
                this.calcularPossibilidadeGanho(this.form.value.valor);
                this.mudancas = true;
            }
        }
    }

    openCupom() {
        this.menuFooterService.toggleBilhete(true);
    }

    closeCupom() {
        this.menuFooterService.toggleBilhete(false);
    }

    closeCupomPre() {
        this.modalRef.close();
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    salvarAposta(dados) {
        if (this.apostaAoVivo) {
            this.setDelay();

            this.apostaEsportivaService.tokenAoVivo(dados)
                .pipe(
                    tap(token => {
                        this.refreshIntervalId = setInterval(() => {
                            if (this.delay > 0) {
                                this.delay--;
                            }
                        }, 1000);

                        dados.token_aovivo = token;
                    }),
                    delay(this.delayReal * 1000),
                    switchMap(() => {
                        return this.apostaEsportivaService.create(dados);
                    }),
                    takeUntil(this.unsub$)
                )
                .subscribe(
                    result => this.apostaSuccess(result),
                    error => this.handleError(error)
                );
        } else {
            this.apostaEsportivaService.create(dados)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => this.apostaSuccess(result),
                    error => this.handleError(error)
                );
        }
    }

    trocarTipoApostaDeslogado(tipo) {
        this.tipoApostaDeslogado = tipo;
        if (tipo === 'preaposta') {
            this.btnText = this.translate.instant('bilhete.preAposta');
        } else {
            this.btnText = this.translate.instant('bilhete.aposta');
        }
    }

    finalizarApostaDeslogado() {
        this.disabledSubmit();

        const values = this.ajustarDadosParaEnvio();

        if (this.tipoApostaDeslogado === 'preaposta') {
            this.preApostaService.create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => this.preApostaSuccess(result.codigo),
                    error => this.handleError(error)
                );
        } else {
            if (this.cartaoApostaForm.valid) {
                const cartaoValues = this.cartaoApostaForm.value;

                if (cartaoValues.manter_cartao) {
                    localStorage.setItem('cartao_chave', cartaoValues.chave);
                } else {
                    localStorage.removeItem('cartao_chave');
                }

                delete cartaoValues.manter_cartao;

                const dados = Object.assign(values, { cartao: cartaoValues });
                this.salvarAposta(dados);
            } else {
                this.enableSubmit();
            }
        }
    }

    stopDelayInterval() {
        clearInterval(this.refreshIntervalId);
    }

    setDelay() {
        this.delay = this.opcoes.delay_aposta_aovivo ? this.opcoes.delay_aposta_aovivo : 10;

        if (this.delay < 10) {
            this.delayReal = 10;
        } else {
            this.delayReal = this.delay;
        }
    }

    aceitarMudancas() {
        localStorage.setItem('mudancas', 'false');
        this.mudancas = false;
    }

    ajustarDadosParaEnvio() {
        const cotacoesLocais = this.paramsService.getCotacoesLocais();
        const values = clone(this.form.value);
        values.itens.map(item => {
            // Cotacação Local
            if (cotacoesLocais[item.jogo_event_id] && cotacoesLocais[item.jogo_event_id][item.cotacao.chave]) {
                item.cotacao.valor = parseFloat(cotacoesLocais[item.jogo_event_id][item.cotacao.chave].valor);
            }

            delete item.jogo;
        });

        return values;
    }

    getPosicaoFinanceira() {
        this.auth.getPosicaoFinanceira()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                posicaoFinanceira => this.posicaoFinanceira = posicaoFinanceira,
                error => {
                    if (error === 'Não autorizado.' || error === 'Login expirou, entre novamente.') {
                        this.auth.logout();
                    } else {
                        this.handleError(error);
                    }
                }
            );
    }
}
