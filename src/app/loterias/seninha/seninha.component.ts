import {Component, OnInit, OnDestroy, Renderer2, ElementRef, ChangeDetectorRef} from '@angular/core';
import {getCurrencySymbol} from '@angular/common';
import {UntypedFormBuilder, UntypedFormArray, Validators} from '@angular/forms';

import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ApostaModalComponent, LoginModalComponent, PreApostaModalComponent} from '../../shared/layout/modals';
import {
    TipoApostaLoteriaService, MessageService,
    SorteioService, ApostaLoteriaService,
    SidebarService, SupresinhaService,
    AuthService, PreApostaLoteriaService,
    ParametrosLocaisService, MenuFooterService, LayoutService
} from '../../services';
import {TipoAposta, Aposta, Sorteio} from '../../models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as range from 'lodash.range';
import { random } from 'lodash';
import { GeolocationService, Geolocation } from 'src/app/shared/services/geolocation.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from '../../services';
import { AccountVerificationService } from 'src/app/shared/services/account-verification.service';
@Component({
    selector: 'app-seninha',
    templateUrl: 'seninha.component.html',
    styleUrls: ['seninha.component.css']
})
export class SeninhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    CURRENCY_SYMBOL = getCurrencySymbol(environment.currencyCode, 'wide');
    numbers = range(1, 61);
    qtdNumerosLista = [];
    qtdNumeros = 100;
    tiposAposta: TipoAposta[] = [];
    sorteios: Sorteio[] = [];
    tipoAposta: TipoAposta;
    aposta = new Aposta();
    opcoes;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn = false;
    modalRef;
    unsub$ = new Subject();
    isCliente;
    mobileScreen = false;
    modoCambista = false;
    headerHeight = 92;
    private geolocation: BehaviorSubject<Geolocation> = new BehaviorSubject<Geolocation>(undefined);

    constructor(
        private sidebarService: SidebarService,
        private auth: AuthService,
        private apostaService: ApostaLoteriaService,
        private preApostaService: PreApostaLoteriaService,
        private tipoApostaService: TipoApostaLoteriaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private supresinhaService: SupresinhaService,
        private renderer: Renderer2,
        private el: ElementRef,
        private modalService: NgbModal,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        public layoutService: LayoutService,
        private cd: ChangeDetectorRef,
        private geolocationService: GeolocationService,
        private helperService: HelperService,
        private translate: TranslateService,
        private accountVerificationService: AccountVerificationService
    ) {
        super();
    }

    ngOnInit() {
        this.modoCambista = this.paramsService.getOpcoes().modo_cambista;
        this.isLoggedIn = this.auth.isLoggedIn();
        this.opcoes = this.paramsService.getOpcoes();
        this.isCliente = this.auth.isCliente();
        this.mobileScreen = window.innerWidth <= 1024;
        this.createForm();

        this.tipoApostaService.getTiposAposta({tipo: 'seninha'}).subscribe(
            tiposAposta => {
                this.tiposAposta = tiposAposta;
                this.tiposAposta.forEach(tipoAposta => {
                    if (tipoAposta.qtdNumeros < this.qtdNumeros) {
                        this.qtdNumeros = tipoAposta.qtdNumeros;
                    }
                    this.qtdNumerosLista.push(tipoAposta.qtdNumeros);
                });

                const dados = {
                    itens: tiposAposta,
                    contexto: 'seninha'
                };

                this.sidebarService.changeItens(dados);
            },
            error => this.messageService.error(error)
        );

        this.sorteioService.getSorteios({tipo: 'seninha', sort: 'data'}).subscribe(
            sorteios => {
                sorteios.forEach(element => {
                    element.formatDate = this.helperService.dateFormat(element.data, "DD/MM/YYYY HH:mm");
                });
                this.sorteios = sorteios;
            },
            error => this.messageService.error(error)
        );

        // Escutando surpresinha vinda do NavigationComponent
        this.supresinhaService.atualizarSupresinha([]);

        this.supresinhaService.numeros.subscribe(numeros => {
            if (numeros.length) {
                this.qtdNumeros = numeros.length;
            }

            this.tiposAposta.forEach(tipoAposta => {
                if (tipoAposta.qtdNumeros === numeros.length) {
                    this.tipoAposta = tipoAposta;
                }
            });

            this.setNumeros(numeros);
        });
        this.menuFooterService.toggleBilheteStatus
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => this.displayPreTicker = res
            );
        this.menuFooterService.setOutraModalidade(true);
        this.menuFooterService.atualizarQuantidade(0);

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });

        this.layoutService.resetHideSubmenu();
    }

    ngOnDestroy() {
        this.menuFooterService.setOutraModalidade(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const headerHeight = this.mobileScreen ? 161 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
        const contentLoteriaEl = this.el.nativeElement.querySelector('.content-loteria');
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(contentLoteriaEl, 'height', `${altura}px`);
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            valor: ['', Validators.compose([
                Validators.required,
                Validators.min(this.opcoes.valor_min_aposta_loterias)
            ])],
            sorteio: [null, Validators.required],
            numeros: this.fb.array([])
        });
    }

    /* Incluir palpite */
    submit() {
        if (!this.isCliente && !this.modoCambista) {
            this.abrirLogin()
        } else {
            const tipoAPosta = this.tiposAposta.find(tipoAposta => tipoAposta.qtdNumeros === this.numeros.length);

            if (tipoAPosta) {
                const item = this.form.value;
                item.sorteio_id = this.form.value.sorteio.id;
                if ((item.valor * this.tipoAposta.cotacao6) < this.opcoes.valor_max_premio_loterias) {
                    item.premio6 = item.valor * this.tipoAposta.cotacao6;
                } else {
                    item.premio6 = this.opcoes.valor_max_premio_loterias;
                }
                if ((item.valor * this.tipoAposta.cotacao5) < this.opcoes.valor_max_premio_loterias) {
                    item.premio5 = item.valor * this.tipoAposta.cotacao5;
                } else {
                    item.premio5 = this.opcoes.valor_max_premio_loterias;
                }
                if ((item.valor * this.tipoAposta.cotacao4) < this.opcoes.valor_max_premio_loterias) {
                    item.premio4 = item.valor * this.tipoAposta.cotacao4;
                } else {
                    item.premio4 = this.opcoes.valor_max_premio_loterias;
                }
                if ((item.valor * this.tipoAposta.cotacao3) < this.opcoes.valor_max_premio_loterias) {
                    item.premio3 = item.valor * this.tipoAposta.cotacao3;
                } else {
                    item.premio3 = this.opcoes.valor_max_premio_loterias;
                }
                this.aposta.itens.push(item);

                this.aposta.valor += item.valor;
                this.aposta.premio += item.premio6;

                this.form.reset();
                this.setNumeros([]);
            } else {
                this.messageService.warning('Quantidade de dezenas insuficiente.');
            }

            this.menuFooterService.atualizarQuantidade(this.aposta.itens.length);
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

    /* Remover palpite */
    removerItem(index) {
        this.aposta.valor -= this.aposta.itens[index].valor;
        this.aposta.itens.splice(index, 1);
        this.menuFooterService.atualizarQuantidade(this.aposta.itens.length);
    }

    removerItens() {
        this.aposta.valor = 0;
        this.aposta.itens = [];
        this.menuFooterService.atualizarQuantidade(this.aposta.itens.length);
    }

    /* Finalizar aposta */
    async create() {
        if (this.isCliente && this.isLoggedIn) {
            if (!this.accountVerificationService.accountVerified.getValue()) {
                this.accountVerificationService.openModalAccountVerificationAlert();
                return;
            }
        }

        this.disabledSubmit();
        const geolocation = this.geolocation.value ?? await this.geolocationService.getCurrentPosition();
        if (this.aposta.itens.length) {
            if (this.auth.isLoggedIn()) {
                const values = {...this.aposta, geolocation: geolocation };

                this.apostaService.create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        aposta => this.apostaSuccess(aposta),
                        error => this.handleError(error)
                    );
            } else {
                this.preApostaService.create(this.aposta)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        preAposta => this.preApostaSucess(preAposta.codigo),
                        error => this.handleError(error)
                    );
            }
        } else {
            this.enableSubmit();
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }

    apostaSuccess(aposta) {
        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;

        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();
        this.menuFooterService.atualizarQuantidade(0);
    }

    preApostaSucess(codigo) {
        this.modalRef = this.modalService.open(PreApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.codigo = codigo;

        this.aposta = new Aposta();
        this.enableSubmit();
        this.closeCupom();
        this.menuFooterService.atualizarQuantidade(0);
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
    }

    get numeros() {
        return this.form.get('numeros') as UntypedFormArray;
    }

    setNumeros(numeros: Number[]) {
        const numerosFCs = numeros.map(n => this.fb.control(n));
        const numerosFormArray = this.fb.array(numerosFCs);
        this.form.setControl('numeros', numerosFormArray);
    }

    compararSorteio(obj1, obj2) {
        return obj1 && obj2 ? (obj1.id === obj2.id) : obj1 === obj2;
    }

    // Disabilitar seleção da quantidade de dezenas menor que a quantidade já selecionadas.
    disabledNumber(number) {
        if (this.numeros.value.length && (number < this.numeros.value.length)) {
            return true;
        }
        return false;
    }

    /* Selecionar número */
    checkNumber(number) {
        const numeros = this.numeros.value;
        const index = numeros.findIndex(n => number === n);

        if (index < 0) {
            if (numeros.length < this.qtdNumeros) {
                numeros.push(number);
                numeros.sort((a, b) => a - b);
                this.setNumeros(numeros);
            }
        } else {
            this.numeros.removeAt(index);
        }

        this.tiposAposta.forEach(tipoAposta => {
            if (tipoAposta.qtdNumeros === this.numeros.length) {
                this.tipoAposta = tipoAposta;
            }
        });
    }

    /* Verificar se o número está selecionado */
    isChecked(number) {
        return this.numeros.value.find(n => number === n);
    }

    controlInvalid(control) {
        return control.invalid && (control.dirty || control.touched);
    }

    openCupom() {
        this.menuFooterService.toggleBilhete(true);
    }

    closeCupom() {
        this.menuFooterService.toggleBilhete(false);
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }


    gerarSupresinha() {
        const numbers = [];

        let qty = this.qtdNumeros;

        for (let index = 0; index < qty; index++) {
            const number = this.generateRandomNumber(numbers);
            numbers.push(number);
        }

        numbers.sort((a, b) => a - b);
        this.supresinhaService.atualizarSupresinha(numbers);
    }

    generateRandomNumber(numbers: Number[]) {
        let number;

        number = random(1, 60);

        const find = numbers.find(n => n === number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber(numbers);
        }
    }
}
