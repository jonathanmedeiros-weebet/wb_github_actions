import { ApostaModalComponent } from './../../shared/layout/modals/aposta-modal/aposta-modal.component';
import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { CancelApostaModalComponent } from '../../shared/layout/modals';
import {
    ApostaEsportivaService, MessageService,
    PrintService, AuthService,
    HelperService
} from './../../services';
import { ApostaEsportiva } from './../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-esporte',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-esporte.component.html',
    styleUrls: ['apuracao-esporte.component.css']
})
export class ApuracaoEsporteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    apostas: ApostaEsportiva[] = [];
    appMobile;
    modalRef;
    showLoadingIndicator = true;
    totais = {
        'valor': 0,
        'comissao': 0,
        'premio': 0,
        'resultado': 0
    };
    dataInicial;
    dataFinal;
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaEsportivaService,
        private messageService: MessageService,
        private printService: PrintService,
        private auth: AuthService,
        private fb: FormBuilder,
        private helperService: HelperService,
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
        this.totais.comissao = 0;
        this.totais.premio = 0;
        this.totais.resultado = 0;
        this.totais.valor = 0;

        let queryParams: any = {
            'data-inicial': this.dataInicial.format('YYYY-MM-DD'),
            'data-final': this.dataFinal.format('YYYY-MM-DD 23:59:59'),
            'sort': '-horario',
            'otimizado': true
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'sort': '-horario',
                'otimizado': true
            };
        }

        this.apostaService.getApostas(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                apostas => {
                    this.apostas = apostas;
                    apostas.forEach(aposta => {
                        this.totais.valor += aposta.valor;
                        this.totais.comissao += aposta.comissao;
                        if (aposta.resultado === 'ganhou') {
                            this.totais.premio += aposta.premio;
                        }
                    });
                    this.totais.resultado = this.totais.valor - this.totais.comissao - this.totais.premio;
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
            status: ['']
        });
    }

    submit() {
        this.showLoadingIndicator = !this.showLoadingIndicator;
        this.getApostas(this.form.value);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    printTicket(aposta: ApostaEsportiva) {
        this.showLoadingIndicator = true;

        this.apostaService.getAposta(aposta.id)
            .subscribe(
                aposta_localizada => {
                    this.printService.sportsTicket(aposta_localizada);

                    this.showLoadingIndicator = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    sharedTicket(aposta) {
        this.showLoadingIndicator = true;

        this.apostaService.getAposta(aposta.id)
            .subscribe(
                aposta_localizada => {
                    this.helperService.sharedSportsTicket(aposta_localizada.id, '');
                    this.showLoadingIndicator = false;
                },
                error => this.handleError(error)
            );
    }

    openModal(aposta) {

        this.showLoadingIndicator = true;

        this.apostaService.getAposta(aposta.id)
            .subscribe(
                aposta_localizada => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });

                    this.modalRef.componentInstance.aposta = aposta_localizada;

                    this.showLoadingIndicator = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    cancel(aposta) {
        this.modalRef = this.modalService.open(CancelApostaModalComponent, { centered: true });
        this.modalRef.result.then(
            (result) => {
                this.apostaService.cancel(aposta.id)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        () => this.getApostas(),
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }

    /*checkCancellation(items) {
        let result = true;

        if (items) {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];

                if (moment(item.jogo.horario).isBefore()) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }*/

    setPagamento(aposta) {
        this.apostaService.setPagamento(aposta.id)
            .subscribe(
                result => {
                    aposta.pago = result.pago;
                    let msg = '';
                    if (result.pago) {
                        msg = 'PAGAMENTO REGISTRADO COM SUCESSO!';
                    } else {
                        msg = 'PAGAMENTO CANCELADO!';
                    }
                    this.messageService.success(msg);
                },
                error => this.handleError(error)
            );
    }

    pagamentoPermitido(aposta) {
        return aposta.resultado && aposta.resultado === 'ganhou' && !aposta.pago;
    }

    trackById(index: number, aposta: any): string {
        return aposta.id;
    }
}
