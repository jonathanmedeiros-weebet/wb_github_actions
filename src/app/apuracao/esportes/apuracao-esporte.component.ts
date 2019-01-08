import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {
    ApostaEsportivaService, MessageService,
    PrintService, AuthService,
    HelperService
} from './../../services';
import { ApostaEsportiva } from './../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-apuracao-esporte',
    templateUrl: 'apuracao-esporte.component.html',
    styleUrls: ['apuracao-esporte.component.css']
})
export class ApuracaoEsporteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    apostas: ApostaEsportiva[] = [];
    @ViewChild('modal') modal: ElementRef;
    @ViewChild('cancelModal') cancelModal: ElementRef;
    apostaSelecionada: ApostaEsportiva;
    appMobile;
    closeResult: string;
    showLoadingIndicator = true;
    totais = {
        'valor': 0,
        'comissao': 0,
        'premio': 0,
        'resultado': 0
    };
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaEsportivaService,
        private messageService: MessageService,
        private printService: PrintService,
        private auth: AuthService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
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
            'data-inicial': moment().subtract('7', 'd').format('YYYY-MM-DD'),
            'data-final': moment().format('YYYY-MM-DD 23:59:59'),
            'sort': '-horario'
        };

        if (params) {
            queryParams = {
                'data-inicial': params.dataInicial,
                'data-final': params.dataFinal,
                'status': params.status,
                'sort': '-horario'
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
                },
                error => this.handleError(error)
            );
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [moment().subtract('7', 'd').format('YYYY-MM-DD'), Validators.required],
            dataFinal: [moment().format('YYYY-MM-DD'), Validators.required],
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
        this.printService.sportsTicket(aposta);
    }

    sharedTicket(aposta) {
        HelperService.sharedSportsTicket(aposta);
    }

    openModal(aposta) {
        this.apostaSelecionada = aposta;

        this.modalService.open(this.modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        }).result.then(
            (result) => { },
            (reason) => { }
        );
    }

    cancel(aposta) {
        this.modalService.open(this.cancelModal, { centered: true })
            .result
            .then(
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

    checkCancellation(items) {
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
    }

    getStatus(resultado) {
        return {
            'perdedor': resultado === 'perdeu',
            'ganhador': resultado === 'ganhou'
        };
    }

    getPagamento(aposta) {
        let result = '';
        if (aposta.resultado && aposta.resultado === 'ganhou') {
            if (aposta.pago) {
                result = 'PAGO';
            } else {
                result = 'AGUARDANDO PAGAMENTO';
            }
        }
        return result;
    }

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
}
