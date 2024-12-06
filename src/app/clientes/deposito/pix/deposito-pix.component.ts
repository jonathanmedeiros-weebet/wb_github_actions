import {Component, OnInit, ViewChild, Renderer2, ElementRef} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FinanceiroService} from '../../../shared/services/financeiro.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {DepositoPix, Rollover} from '../../../models';
import {ParametrosLocaisService} from '../../../shared/services/parametros-locais.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HelperService } from 'src/app/services';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmModalComponent, RegrasBonusModalComponent } from '../../../shared/layout/modals';
import { Router } from '@angular/router';
import { TransacoesHistoricoComponent } from '../../transacoes-historico/transacoes-historico.component';
import { TranslateService } from '@ngx-translate/core';

declare var WeebetMessage: any;


@Component({
    selector: 'ngbd-modal-content',
    styleUrls: ['./deposito-pix.component.css'],
    template: `
    <div class="modal-body">
        <h4 class="modal-title text-center fs-20px" id="modal-basic-title">Depósito PIX</h4>
        <a type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss('pix-modal-closed')">
            <i class="fa fa-times"></i>
        </a>

        <p class="info text-center">Aponte a câmera do seu celular para realizar o depósito ou copie e compartilhe o QR Code</p>

        <label class="label-tempo">Tempo restante para pagar</label>
        <span class="tempo">{{ minute }}:{{ secondShow }}</span>

        <div class="qr-code" *ngIf="qrCodeBase64">
            <img [ngStyle]="{'width': '250px'}" *ngIf="!['sauto_pay', 'gerencianet', 'pagfast', 'paag','pixs'].includes(selectedPaymentMethod)" src="data:image/jpeg;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'gerencianet'" src="{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'sauto_pay'" [src]="sautoPayQr"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'pagfast'" src="data:image/png;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px', 'background-color':'#ffffff'}" *ngIf="selectedPaymentMethod === 'paag'" src="{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'pixs'" src="{{ qrCodeBase64 }}"/>
        </div>
        <div class="qr-code" *ngIf="!qrCodeBase64">
            <ngx-qrcode
                [value]="qrCode"
                cssClass="aclass"
                errorCorrectionLevel="L">
            </ngx-qrcode>
        </div>
        <span class="valor">Valor: <b>{{ valorPix }}</b></span>

        <div class="buttons">
            <button class="btn btn-custom2 btn-w-100" (click)="compartilhar()"><i class="fa fa-share"></i> Compartilhar QR Code</button>
            <button class="btn btn-custom2 btn-w-100" ngxClipboard [cbContent]="qrCode"><i class="fa fa-copy"></i> Copiar código</button>
        </div>
    </div>
    `
})
export class NgbdModalContent {
    valorPix;
    qrCodeBase64;
    qrCode;
    selectedPaymentMethod;
    sautoPayQr;
    minute = 20;
    second = 0;
    secondShow = '00';
    isAppMobile;

    constructor(
        public modal: NgbActiveModal,
        private _sanitizer: DomSanitizer,
        private _helper: HelperService,
        private domSanitizer: DomSanitizer,
        private paramsService: ParametrosLocaisService,
        private translate: TranslateService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    get customCasinoBetting(): string {
        return this.paramsService.getCustomCasinoName(
            this.translate.instant('bet.casinoBetting').toLowerCase(),
            this.translate.instant('geral.cassino').toLowerCase()
        );
    }

    ngOnInit() {
        if (this.selectedPaymentMethod === 'sauto_pay') {
            const SautoPayUrl = 'data:image/svg+xml;base64,' + this.qrCodeBase64;
            this.sautoPayQr = this.domSanitizer.bypassSecurityTrustUrl(SautoPayUrl);
        }
        let timer = setInterval(() => {
            if (this.second == 0) {
                this.minute -= 1;
                this.second = 59;
            } else {
                this.second -= 1;
            }

            this.secondShow = this.second < 10 ? '0' + this.second : String(this.second);

            if (this.minute <= 0 && this.second <= 0) {
                clearInterval(timer);
            }
        }, 1000);
        this.isAppMobile = this.authService.isAppMobile();
    }

    copyCode(code) {
        console.log('Copiado: ', code);
    }

    compartilhar() {
        const imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.qrCodeBase64);
        const dataToSend = {
            message: `Deposito PIX`,
            file: imagePath,
            data: `Qrcode para deposito PIX`,
            action: 'shareURL'
        };

        const base64ToBlob = (base64: string, contentType: string): Blob => {
            const byteCharacters = atob(base64); 
            const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: contentType });
        };
        
        const contentType = "image/png";
        const base64Data = this.qrCodeBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        const blob = base64ToBlob(base64Data, contentType);
        const file = new File([blob], "shared-image.png", { type: contentType });

        if (this.isAppMobile) {
            WeebetMessage.postMessage(JSON.stringify(dataToSend));
        } else {
            if (window.navigator.share) {
                window.navigator.share({
                    files: [file],
                    title: dataToSend.message,
                    text: "Veja o QR Code"
                }).catch(error => {
                    console.error("Erro no compartilhamento:", error);
                    this.messageService.error('Erro ao compartilhar a imagem.');
                });
            } else {
                this.messageService.error('Compartilhamento não suportado pelo seu navegador');
            }
        }
    }
}
@Component({
    selector: 'app-deposito-pix',
    templateUrl: './deposito-pix.component.html',
    styleUrls: ['./deposito-pix.component.css']
})
export class DepositoPixComponent extends BaseFormComponent implements OnInit {
    @ViewChild('verificarPromocaoModal', {static: true}) verificarPromocaoModal;

    modalPromocao;
    pixModal;
    pix: DepositoPix;
    rolloverAtivo: Rollover[] = [];

    bonusOption = '';
    availablePaymentMethods;
    paymentMethodSelected = '';
    sautoPayQr;
    bonusType = '';
    bonusTypeFormatted = '';
    bonusTypeFormattedTranslated = '';

    novoSaldo;
    valorMinDeposito;
    valorPix = 0;
    verificacoes = 0;
    amountSportsBonus = 0;
    maxAmountSportsBonus = 0;
    amountCasinoBonus = 0;
    maxAmountCasinoBonus = 0;

    bonusCassino = false;
    bonusEsportivo = false;
    droppedBonus = true;
    droppedPromoCode = true;
    exibirMensagemPagamento = false;
    isMobile = false;
    onlyOneModality = false;
    permitirBonusPrimeiroDeposito = false;
    submitting = false;
    clearSetInterval;

    modalRef;

    public valuesShortcuts: number[] = [10, 20, 50, 100, 500, 1000];

    constructor(
        private domSanitizer: DomSanitizer,
        private el: ElementRef,
        private fb: UntypedFormBuilder,
        private financeiroService: FinanceiroService,
        private helperService: HelperService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private paramsLocais: ParametrosLocaisService,
        private renderer: Renderer2,
        private router: Router,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        this.valorMinDeposito = this.paramsLocais.getOpcoes().valor_min_deposito_cliente;
        this.availablePaymentMethods = this.paramsLocais.getOpcoes().available_payment_methods;
        this.paymentMethodSelected = this.availablePaymentMethods[0];
        this.createForm();
        this.financeiroService.bonusPrimeiroDepositoPermitido()
            .subscribe(
                res => {
                    this.permitirBonusPrimeiroDeposito = res.permitir_bonificacao;
                    this.bonusType = res.bonus_type == 'primeiro_deposito' ? 'rollover.firstDepositBonus' : 'rollover.depositBonus';
                    this.bonusEsportivo = res.bonus_esportivo;
                    this.bonusCassino = res.bonus_cassino;
                    this.onlyOneModality = !(res.bonus_esportivo && res.bonus_cassino);
                    this.maxAmountSportsBonus = res.max_bonus_esportivo;
                    this.maxAmountCasinoBonus = res.max_bonus_cassino;
                    this.checkOktoTermsAcceptance(res.accepted_okto_terms);

                    if (!res.permitir_bonificacao) {
                        this.form.get('bonus').patchValue('nenhum');
                        this.bonusOption = 'nenhum';
                    } else {
                        this.getRollovers();
                    }
                },
                error => this.handleError(error)
            );
    }

    createForm() {
        this.form = this.fb.group({
            valor: [0, [Validators.required, Validators.min(this.valorMinDeposito)]],
            bonus: [this.bonusOption, Validators.required],
            paymentMethod: [this.paymentMethodSelected, Validators.required],
            promoCode: [""]
        });
    }

    checkOktoTermsAcceptance(acceptedOktoTerms = false) {
        if (this.availablePaymentMethods.includes('okto') && !acceptedOktoTerms) {
            this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
            this.modalRef.componentInstance.title = 'Termos de uso Okto';
            this.modalRef.componentInstance.msg = 'Para continuar com as movimentações financeiras, é necessário aceitar os termos de uso da instituição financeira Okto. Caso não aceite, não será possível prosseguir. Deseja aceitar os termos?';

            this.modalRef.result.then(
                (result) => {
                    this.financeiroService.acceptOktoTerms().subscribe(
                        res =>{
                            this.messageService.success('Você aceitou os termos de uso. Agora, você pode realizar movimentações financeiras.');
                        },
                        error => {
                            this.messageService.warning('Algo não saiu muito bem. Tente novamente mais tarde.');
                            this.router.navigate(['/']);
                        }
                    )                    
                },
                (reason) => { 
                    this.messageService.warning('Você não aceitou os termos de uso. Você será redirecionado para a página inicial.');
                    this.router.navigate(['/']);
                }
            );
        }
    }

    changePaymentMethodOption(paymentMethod: string) {
        this.paymentMethodSelected = paymentMethod;
        this.form.get('paymentMethod').patchValue(paymentMethod);
    }

    changeAmount(amount) {
        const newAmount = this.form.value.valor + amount;
        this.form.patchValue({ 'valor': newAmount});
        this.calculateBonusAmount();
    }

    changeBonusOption(bonusOption: string) {
        this.bonusOption = bonusOption;
        this.form.get('bonus').patchValue(bonusOption);
    }

    calculateBonusAmount()
    {
        let enteredAmount = this.form.value.valor;

        this.amountSportsBonus = enteredAmount;
        this.amountCasinoBonus = enteredAmount;

        if (enteredAmount > this.maxAmountSportsBonus) {
            this.amountSportsBonus = this.maxAmountSportsBonus;
        }

        if (enteredAmount > this.maxAmountCasinoBonus) {
            this.amountCasinoBonus = this.maxAmountCasinoBonus;
        }
    }

    toggleBonusSection() {
        this.droppedBonus = !this.droppedBonus;

        const bonusWrapper = this.el.nativeElement.querySelector('#bonus-wrapper');
        this.renderer.setStyle(bonusWrapper, 'display', this.droppedBonus ? 'block' : 'none');
    }

    togglePromoCodeSection() {
        this.droppedPromoCode = !this.droppedPromoCode;

        const promoCodeWrapper = this.el.nativeElement.querySelector('#promo-code-wrapper');
        this.renderer.setStyle(promoCodeWrapper, 'display', this.droppedPromoCode ? 'block' : 'none');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    solicitarDeposito() {
        if (this.rolloverAtivo.length > 0 && this.bonusOption !== 'nenhum') {
            this.avisoPromocao();
        } else {
            this.onSubmit();
        }
    }

    avisoPromocao() {
        if (this.form.valid) {
            this.modalPromocao = this.modalService.open(this.verificarPromocaoModal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                centered: true,
                windowClass: 'modal-700'
            });
        } else {
            this.checkFormValidations(this.form);
        }
    }

    confirmarPromocao() {
        this.modalPromocao.close();
        this.onSubmit();
    }

    submit() {
            this.submitting = true;
            this.novoSaldo = 0;
            this.exibirMensagemPagamento = false;
            const detalhesPagamento = this.form.value;
            detalhesPagamento.metodo = 'pix';
            this.financeiroService.processarPagamento(detalhesPagamento)
                .subscribe(
                    res => {
                        this.pix = res;
                        this.openPixModal();
                        this.submitting = false;
                    },
                    error => {
                        this.handleError(error);
                        this.submitting = false;
                    }
                );
    }

    openPixModal() {
        if (!this.pix) {
            return;
        }

        this.pixModal = this.modalService.open(NgbdModalContent, { centered: true });
        this.pixModal.componentInstance.valorPix = this.helperService.moneyFormat(this.pix.valor);
        this.pixModal.componentInstance.qrCodeBase64 = this.pix.qr_code_base64;
        this.pixModal.componentInstance.qrCode = this.pix.qr_code;
        this.pixModal.componentInstance.selectedPaymentMethod = this.pix.selected_payment_method;

        if (this.paymentMethodSelected === 'sauto_pay') {
            const SautoPayUrl = 'data:image/svg+xml;base64,' + this.pix.qr_code_base64;
            this.sautoPayQr = this.domSanitizer.bypassSecurityTrustUrl(SautoPayUrl);
        }

        this.clearSetInterval = setInterval(() => {
            this.verificarPagamento(this.pix);
        }, 10000);

        this.pixModal.result.then(
            (result) => {},
            (reason) => {
                if (reason == 'pix-modal-closed') {
                    this.novoPix();
                }
            }
        );
    }

    copyInputMessage(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.messageService.success('QRCode copiado para área de transferência');
    }

    novoPix() {
        this.pix = null;
        this.form.patchValue({'valor': 0, 'bonus': '', 'promoCode': ''});
        this.submitting = false;
        clearInterval(this.clearSetInterval);
        this.verificacoes = 0;
    }

    verificarPagamento(pix) {
        if (this.verificacoes >= 12) {
            clearInterval(this.clearSetInterval);
            this.verificacoes = 0;
        } else {
            this.financeiroService.verificarPagamento({'pagamento_id': pix.pagamento_id})
                .subscribe(
                    res => {
                        if (res.deposito_status === 'approved') {
                            this.modalService.dismissAll();
                            this.novoPix();
                            if (this.isMobile) {
                                this.activeModal.dismiss('Cross click');
                                this.modalService.open(TransacoesHistoricoComponent);
                            } else {
                                this.router.navigate(['clientes/transacoes-historico']);
                            }
                        }
                    },
                    error => {
                        this.handleError(error);
                    }
                );
            this.verificacoes++;
        }
    }

    abrirRegrasBonus() {
        this.modalService.open(RegrasBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }

    getRollovers() {
        const queryParams: any = {
            'status': 'ativo',
        };
        this.financeiroService.getRollovers(queryParams)
            .subscribe(
                response => {
                    this.rolloverAtivo = response;
                },
                error => {
                    this.handleError(error);
                }
            );
    }
}
