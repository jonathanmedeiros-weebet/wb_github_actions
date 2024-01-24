import {Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FinanceiroService} from '../../../shared/services/financeiro.service';
import {MessageService} from '../../../shared/services/utils/message.service';
import {DepositoPix, Rollover} from '../../../models';
import {ParametrosLocaisService} from '../../../shared/services/parametros-locais.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/services';
import { DomSanitizer } from '@angular/platform-browser';
import { RegrasBonusModalComponent } from '../../../shared/layout/modals/regras-bonus-modal/regras-bonus-modal.component';


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
            <img [ngStyle]="{'width': '250px'}" *ngIf="!['sauto_pay', 'gerencianet', 'pagfast', 'paag'].includes(metodoPagamento)" src="data:image/jpeg;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="metodoPagamento === 'gerencianet'" src="{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="metodoPagamento === 'sauto_pay'" [src]="sautoPayQr"/>
            <img [ngStyle]="{'width': '170px'}" *ngIf="metodoPagamento === 'pagfast'" src="data:image/png;base64,{{ qrCodeBase64 }}"/>
            <img [ngStyle]="{'width': '170px', 'background-color':'#ffffff'}" *ngIf="metodoPagamento === 'paag'" src="{{ qrCodeBase64 }}"/>
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
    metodoPagamento;
    sautoPayQr;
    minute = 20;
    second = 0;
    secondShow = '00';

    constructor(
        public modal: NgbActiveModal,
        private _sanitizer: DomSanitizer,
        private _helper: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private domSanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.metodoPagamento = this.paramsLocais.getOpcoes().api_pagamentos;
        if (this.metodoPagamento === 'sauto_pay') {
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
    }

    copyCode(code) {
        console.log('Copiado: ', code);
    }

    compartilhar() {
        const imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.qrCodeBase64);
        this._helper.sharedDepositoPix(imagePath);
    }
}
@Component({
    selector: 'app-deposito-pix',
    templateUrl: './deposito-pix.component.html',
    styleUrls: ['./deposito-pix.component.css']
})
export class DepositoPixComponent extends BaseFormComponent implements OnInit {
    @ViewChild('verificarPromocaoModal', {static: true}) verificarPromocaoModal;
    submitting = false;
    pix: DepositoPix;
    exibirMensagemPagamento = false;
    novoSaldo;
    clearSetInterval;
    verificacoes = 0;
    valorMinDeposito;
    valorPix = 0;
    metodoPagamento;
    sautoPayQr;
    isMobile = false;
    permitirBonusPrimeiroDeposito = false;
    bonusEsportivo = false;
    bonusCassino = false;
    opcaoBonus = '';
    rolloverAtivo: Rollover[] = [];
    modalPromocao;

    constructor(
        private fb: UntypedFormBuilder,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
        private helperService: HelperService,
        private domSanitizer: DomSanitizer,
    ) {
        super();
    }

    ngOnInit() {
        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        this.valorMinDeposito = this.paramsLocais.getOpcoes().valor_min_deposito_cliente;
        this.metodoPagamento = this.paramsLocais.getOpcoes().api_pagamentos;
        this.createForm();
        this.financeiroService.bonusPrimeiroDepositoPermitido()
            .subscribe(
                res => {
                    this.permitirBonusPrimeiroDeposito = res.permitir_bonificacao;
                    this.bonusEsportivo = res.bonus_esportivo;
                    this.bonusCassino = res.bonus_cassino;
                    if (!res.permitir_bonificacao) {
                        this.form.get('bonus').patchValue('nenhum');
                        this.opcaoBonus = 'nenhum';
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
            bonus: [this.opcaoBonus, Validators.required]
        });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    solicitarDeposito() {
        if (this.rolloverAtivo.length > 0 && this.opcaoBonus !== 'nenhum') {
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
                        const modalRef = this.modalService.open(NgbdModalContent, { centered: true });
                        modalRef.componentInstance.valorPix = this.helperService.moneyFormat(res.valor);
                        modalRef.componentInstance.qrCodeBase64 = res.qr_code_base64;
                        modalRef.componentInstance.qrCode = res.qr_code;

                        this.pix = res;
                        if (this.metodoPagamento === 'sauto_pay') {
                            const SautoPayUrl = 'data:image/svg+xml;base64,' + this.pix.qr_code_base64;
                            this.sautoPayQr = this.domSanitizer.bypassSecurityTrustUrl(SautoPayUrl);
                        }

                        this.clearSetInterval = setInterval(() => {
                            this.verificarPagamento(res);
                        }, 10000);

                        this.submitting = false;
                    },
                    error => {
                        this.handleError(error);
                        this.submitting = false;
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

    selecionarOpcaoBonus(opcaoBonus) {
        this.opcaoBonus = opcaoBonus;
        this.form.get('bonus').patchValue(opcaoBonus);
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
