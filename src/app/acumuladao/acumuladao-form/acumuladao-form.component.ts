import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

import {AcumuladaoService, AuthService, LayoutService, MenuFooterService, MessageService, ParametrosLocaisService} from './../../services';
import {Acumuladao} from './../../models';
import {PreApostaModalComponent, ApostaModalComponent, LoginModalComponent} from '../../shared/layout/modals';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';
import { GeolocationService, Geolocation } from 'src/app/shared/services/geolocation.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';

@Component({
    selector: 'app-acumuladao-form',
    templateUrl: './acumuladao-form.component.html',
    styleUrls: ['./acumuladao-form.component.css']
})
export class AcumuladaoFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('apostaDeslogadoModal', { static: false }) apostaDeslogadoModal;
    showLoadingIndicator = true;
    encerrado = true;
    acumuladao = new Acumuladao();
    disabled = false;
    displayPreTicker = false;
    modoCambista = false;
    modalRef;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: UntypedFormGroup;
    opcoes;
    dados;
    isCliente;
    isLoggedIn;
    unsub$ = new Subject();
    headerHeight;
    mobileScreen;
    private geolocation: BehaviorSubject<Geolocation> = new BehaviorSubject<Geolocation>(undefined);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
        private layoutService: LayoutService,
        public modalService: NgbModal,
        private fb: UntypedFormBuilder,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2,
        private el: ElementRef,
        private geolocationService: GeolocationService,
        private accountVerificationService: AccountVerificationService
    ) {
        super();
    }

    ngOnInit() {
        this.modoCambista = this.paramsService.getOpcoes().modo_cambista;
        this.mobileScreen = window.innerWidth <= 1024;
        this.opcoes = this.paramsService.getOpcoes();
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

        this.route.params.subscribe(
            params => {
                if (params['id']) {
                    const id = +params['id'];
                    this.acumuladaoService.getAcumuladao(id)
                        .subscribe(
                            acumuladao => {
                                this.acumuladao = acumuladao;

                                if (moment().isAfter(acumuladao.data_encerramento)) {
                                    this.encerrado = true;
                                } else {
                                    this.encerrado = false;
                                }

                                this.showLoadingIndicator = false;
                            },
                            error => this.handleError(error)
                        );
                }
            }
        );

        this.createForm();
        this.menuFooterService.toggleBilheteStatus
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.displayPreTicker = res
            );
        this.menuFooterService.atualizarQuantidade(1);

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    definirAltura() {
        const headerHeight = this.mobileScreen ? 161 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
        const contentEl = this.el.nativeElement.querySelector('.content');
        this.renderer.setStyle(contentEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', (this.isCliente || !this.modoCambista) ? '' : Validators.required]
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

    async submit() {
        if (!this.isCliente && !this.modoCambista) {
            this.abrirLogin();
        } else {
            if (this.isCliente && this.isLoggedIn) {
                if (!this.accountVerificationService.accountVerified.getValue()) {
                    this.accountVerificationService.openModalAccountVerificationAlert();
                    return;
                }
            }

            let msg = '';
            let valid = true;
            this.dados = {
                apostador: this.form.value.apostador,
                acumuladao_id: this.acumuladao.id,
                jogos: [],
            };

            this.acumuladao.jogos.forEach(j => {
                if ((j.time_a_resultado != null) && (j.time_b_resultado != null)) {
                    this.dados.jogos.push({
                        id: j.id,
                        time_a_resultado: j.time_a_resultado,
                        time_b_resultado: j.time_b_resultado
                    });
                } else {
                    valid = false;
                    msg = 'Por favor, preencha todos os placares';
                }
            });

            if (valid) {
                if (this.auth.isLoggedIn()) {
                    this.finalizarAposta();
                } else {
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
                            result => { },
                            reason => { }
                        );
                }
            } else {
                this.messageService.error(msg);
            }
        }
    }

    abrirLogin() {
        const options = {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-400 modal-h-350 modal-login',
            centered: true,
        };

        this.modalRef = this.modalService.open(
            LoginModalComponent, options
        );
    }

    back() {
        this.menuFooterService.atualizarQuantidade(0);
        this.router.navigate(['/acumuladao/listagem']);
    }

    openCupom() {
        this.menuFooterService.toggleBilhete(true);
    }

    closeCupom() {
        this.menuFooterService.toggleBilhete(false);
    }

    trocarTipoApostaDeslogado(tipo) {
        this.tipoApostaDeslogado = tipo;
        if (tipo === 'preaposta') {
            this.btnText = 'Pré-Aposta';
        } else {
            this.btnText = 'Aposta';
        }
    }

    finalizarApostaDeslogado() {
        if (this.tipoApostaDeslogado === 'preaposta') {
            this.acumuladaoService.createPreAposta(this.dados)
                .subscribe(
                    aposta => this.success(aposta, true),
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

                this.dados = Object.assign(this.dados, { cartao: cartaoValues });
                this.finalizarAposta();
            }
        }
    }

    finalizarAposta() {
        this.acumuladaoService.createAposta(this.dados)
            .subscribe(
                aposta => this.success(aposta),
                error => this.handleError(error)
            );
    }

    success(aposta, preAposta?) {
        if (this.modalRef) {
            this.modalRef.close();
        }

        let modal;
        if (preAposta) {
            modal = PreApostaModalComponent;
        } else {
            modal = ApostaModalComponent;
        }

        this.modalRef = this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        if (preAposta) {
            this.modalRef.componentInstance.codigo = aposta.codigo;
        } else {
            this.modalRef.componentInstance.aposta = aposta;
            this.modalRef.componentInstance.primeiraImpressao = true;
            this.modalRef.componentInstance.showCancel = true;
        }

        this.modalRef.result.then(
            (result) => { },
            (reason) => { }
        );

        this.form.reset();
        this.acumuladao.jogos.forEach(j => {
            j.time_a_resultado = null;
            j.time_b_resultado = null;
        });
    }

    handleError(msg: string) {
        this.messageService.error(msg);
    }
}
