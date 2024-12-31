import {Component, Input, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FinanceiroService} from '../../../shared/services/financeiro.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {DepositoPix} from '../../../models';
import {ParametrosLocaisService} from '../../../shared/services/parametros-locais.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HelperService } from 'src/app/services';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

declare var WeebetMessage: any;

@Component({
    selector: 'ngbd-modal-content',
    styleUrls: ['./deposito-pix.component.css'],
    template: `
    <div class="modal-body">
        <h4 class="modal-title text-center fs-20px" id="modal-basic-title">Depósito PIX</h4>
        <a type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss('Cross click')">
            <i class="fa fa-times"></i>
        </a>

        <p class="info text-center">Aponte a câmera do seu celular para realizar o depósito ou copie e compartilhe o QR Code</p>

        <label class="label-tempo">Tempo restante para pagar</label>
        <span class="tempo">{{ minute }}:{{ secondShow }}</span>

        <div class="qr-code" *ngIf="qrCodeBase64">
            <img [ngStyle]="{'width': '250px'}" *ngIf="!['sauto_pay', 'gerencianet', 'pagfast', 'paag'].includes(selectedPaymentMethod)" src="data:image/jpeg;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'gerencianet'" src="{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'sauto_pay'" [src]="sautoPayQr"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="selectedPaymentMethod === 'pagfast'" src="data:image/png;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px', 'background-color':'#ffffff'}" *ngIf="selectedPaymentMethod === 'paag'" src="{{ qrCodeBase64 }}"/>
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
            <button class="btn btn-custom2 btn-w-100" ngxClipboard [cbContent]="qrCode" (click)="copyCode()"><i class="fa fa-copy"></i>{{ copyButtonText }}</button>
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
    copyButtonText; 
    isAppMobile;

    constructor(
        public modal: NgbActiveModal,
        private _sanitizer: DomSanitizer,
        private _helper: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private domSanitizer: DomSanitizer,
        private translate: TranslateService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

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
                clearInterval(timer)
            }
        }, 1000);
        
        this.copyButtonText = this.translate.instant('deposito.copyCode');
        this.isAppMobile = this.authService.isAppMobile();
    }

    copyCode() {
        this.translate.get('deposito.copied').subscribe((translatedText) => {
            this.copyButtonText = translatedText; 

            setTimeout(() => {
                this.copyButtonText = this.translate.instant('deposito.copyCode');
            }, 1000);
        }); 
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
                    text: `${this.qrCode}\n\n`
                })
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
    pixModal;
    pix: DepositoPix;

    sautoPayQr;
    availablePaymentMethods;
    paymentMethodSelected = '';

    novoSaldo;
    verificacoes = 0;
    valorPix = 0;
    valorMinDeposito;

    submitting = false;
    exibirMensagemPagamento = false;
    isMobile = false;

    clearSetInterval;

    constructor(
        private fb: UntypedFormBuilder,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
        private helperService: HelperService,
        private domSanitizer: DomSanitizer,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        this.valorMinDeposito = this.paramsLocais.getOpcoes().valor_min_deposito_cliente;
        this.availablePaymentMethods = this.paramsLocais.getOpcoes().payment_methods_available_for_bettors;
        this.paymentMethodSelected = this.availablePaymentMethods[0];
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            valor: [0, [Validators.required, Validators.min(this.valorMinDeposito)]],
            paymentMethod: [this.paymentMethodSelected, Validators.required]
        });
    }

    changePaymentMethodOption(paymentMethod: string) {
        this.paymentMethodSelected = paymentMethod;
        this.form.get('paymentMethod').patchValue(paymentMethod);
    }

    changeAmount(amount) {
        this.form.patchValue({ 'valor': amount });
    }

    handleError(error: string) {
        this.messageService.error(error);
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
        this.form.patchValue({'valor': 0});
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
                            this.novoSaldo = res.novo_saldo;
                            this.exibirMensagemPagamento = true;
                            this.novoPix();
                        }
                    },
                    error => {
                        this.handleError(error);
                    }
                );
            this.verificacoes++;
        }
    }
}
