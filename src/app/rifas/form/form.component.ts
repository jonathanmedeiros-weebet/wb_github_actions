import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {RifaApostaService} from '../../shared/services/rifa/rifa-aposta.service';
import {AuthService} from '../../shared/services/auth/auth.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {RifaBilheteService} from '../../shared/services/rifa/rifa-bilhete.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import {LayoutService} from '../../shared/services/utils/layout.service';
import {takeUntil} from 'rxjs/operators';
import * as clone from 'clone';
import {ApostaModalComponent, LoginModalComponent} from '../../shared/layout/modals';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';

@Component({
  selector: 'app-rifa-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @ViewChild('apostaDeslogadoModal', {static: false}) apostaDeslogadoModal;
    modalRef;
    possibilidadeGanho = 0;
    opcoes;
    apostaMinima;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText = 'Pré-Aposta';
    soterio = null;
    quantidade_numeros = 0;
    versao_app = '1.0';

    cartaoApostaForm: UntypedFormGroup;
    refreshIntervalId;
    unsub$ = new Subject();
    isCliente;
    valorFocado = false;
    modoCambista = false;
    mobileScreen;
    headerHeight = 92;

    submiting = false;

    constructor(
        private apostaService: RifaApostaService,
        private auth: AuthService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: UntypedFormBuilder,
        private bilheteService: RifaBilheteService,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal,
        private menuFooterService: MenuFooterService,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.createForm();
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
                                        this.form.patchValue({apostador: 'cliente'});
                                    }
                                }
                            );
                    }
                }
            );
        this.opcoes = this.paramsService.getOpcoes();
        this.apostaMinima = this.opcoes.valor_min_aposta;

        this.menuFooterService.setOutraModalidade(true);

        this.bilheteService.soterio
            .pipe(takeUntil(this.unsub$))
            .subscribe(result => {
                this.setSorteio(result);
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

    get sorteio() {
        return this.soterio;
    }

    ngOnDestroy() {
        this.menuFooterService.setOutraModalidade(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        // const altura = window.innerHeight - this.headerHeight;
        // const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        // this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    adicionarNumeros(numeros) {
        let new_qt = this.form.value.numeros + numeros;

        if(new_qt < 0){
            return;
        }

        this.form.patchValue({'valor': new_qt*this.sorteio.valor_numero,'numeros':new_qt});


    }

    setSorteio(sorteio= null) {
        if (sorteio) {
            this.soterio = sorteio;
            this.form.patchValue({'sorteio_id': sorteio.id});
            this.removerNumeros();
        } else {
            this.soterio = null;
            this.form.patchValue({'sorteio_id': ''});
            this.removerNumeros();
        }

    }

    createForm() {
        this.form = this.fb.group({
            sorteio_id: ['', [Validators.required]],
            apostador: ['', (this.isCliente || !this.modoCambista) ? '' : [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima)]],
            numeros: [0, [Validators.required, Validators.min(1)]]
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
        this.form.patchValue({'valor': valor});
    }

    get numeros() {
        return this.form.get('numeros').value;
    }

    removerNumeros() {
        this.form.patchValue({'valor': 0, 'numeros': 0});
    }

    setFocoValor(focus: boolean) {
        this.valorFocado = focus;
    }

    submit() {
        if (!this.isCliente && !this.modoCambista) {
            this.abrirLogin();
        } else {
            this.disabledSubmit();

            let valido: boolean = true;
            let msg: string = '';

            if (valido) {
                if (this.isLoggedIn) {
                    const values = clone(this.form.value);

                    this.salvarAposta(values);
                } else {
                    this.enableSubmit();

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


        this.resetForm();

        this.cartaoApostaForm.reset();


        if (this.isCliente) {
            this.form.patchValue({'apostador': 'cliente'});
        }

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;
        this.menuFooterService.atualizarQuantidade(0);
    }

    handleError(error) {
        this.enableSubmit();
        this.messageService.error(error);
    }

    openCupom() {
        this.menuFooterService.toggleBilhete(true);
    }

    closeCupom() {
        this.menuFooterService.toggleBilhete(false);
    }

    disabledSubmit() {
        this.submiting = true;
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
        this.submiting = false;
    }

    salvarAposta(dados) {
        dados.versao_app = this.versao_app;
        this.apostaService.create(dados)
            .subscribe(
                result => this.apostaSuccess(result),
                error => this.handleError(error)
            );
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

    resetForm() {
        this.form.reset();
        this.removerNumeros();
        this.form.patchValue({'sorteio_id': this.soterio.id});
    }

}
