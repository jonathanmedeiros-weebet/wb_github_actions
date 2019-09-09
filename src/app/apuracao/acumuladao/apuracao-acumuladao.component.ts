import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { ApostaAcumuladaoModalComponent, ConfirmModalComponent } from '../../shared/layout/modals';
import { AcumuladaoService, ApostaService, MessageService, AuthService } from './../../services';
import { AcumuladaoAposta } from './../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-acumuladao',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-acumuladao.component.html',
    styleUrls: ['apuracao-acumuladao.component.css']
})
export class ApuracaoAcumuladaoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    apostas: AcumuladaoAposta[] = [];
    appMobile;
    modalRef;
    showLoadingIndicator = true;
    totais = {
        'valor': 0,
    };
    dataInicial;
    dataFinal;
    unsub$ = new Subject();

    constructor(
        private acumuladaoService: AcumuladaoService,
        private apostaServive: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();

        if (moment().day() === 0 || moment().day() === 1) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');

            if (moment().day() === 0) {
                this.dataFinal = moment();
            } else {
                this.dataFinal = moment().subtract(1, 'days');
            }
        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.getApostas();
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getApostas(params?) {
        this.totais.valor = 0;

        let queryParams: any = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD 23:59:59'),
            'sort': '-horario'
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'apostador': params.apostador,
                'sort': '-horario'
            };
        }

        this.acumuladaoService.getApostas(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                apostas => {
                    this.apostas = apostas;
                    apostas.forEach(aposta => {
                        if (!aposta.cartao_aposta) {
                            this.totais.valor += aposta.valor;
                        }
                    });
                    this.showLoadingIndicator = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            status: [''],
            apostador: ['']
        });
    }

    submit() {
        this.showLoadingIndicator = !this.showLoadingIndicator;
        this.getApostas(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    openModal(aposta) {
        this.showLoadingIndicator = true;

        this.modalRef = this.modalService.open(ApostaAcumuladaoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.showCancel = true;
        // this.modalRef.componentInstance.ultimaAposta = aposta_localizada.ultima_aposta;

        this.modalRef.result.then(
            (result) => {
                switch (result) {
                    case 'cancel':
                        this.cancelar(aposta);
                        break;
                    case 'pagamento':
                        this.pagarAposta(aposta);
                        break;
                    default:
                        break;
                }
            },
            (reason) => { }
        );

        this.showLoadingIndicator = false;
        this.cd.detectChanges();
    }

    cancelar(aposta) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
        this.modalRef.componentInstance.title = 'Cancelar Aposta';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar a aposta?';

        this.modalRef.result.then(
            (result) => {
                this.apostaServive.cancelar(aposta.id)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        () => this.getApostas(this.form.value),
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }

    pagarAposta(aposta) {
        this.apostaServive.pagar(aposta.id)
            .subscribe(
                result => {
                    aposta.pago = result.pago;
                    this.cd.detectChanges();

                    if (result.pago) {
                        this.messageService.success('PAGAMENTO REGISTRADO COM SUCESSO!');
                    } else {
                        this.messageService.success('PAGAMENTO CANCELADO!');
                    }
                },
                error => this.handleError(error)
            );
    }

    trackById(index: number, aposta: any): string {
        return aposta.id;
    }
}
