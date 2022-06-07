import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy,
    Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaEncerramentoModalComponent, ApostaModalComponent, ConfirmModalComponent } from '../../shared/layout/modals';
import { ApostaEsportivaService, ApostaService, MessageService, AuthService, ParametrosLocaisService } from './../../services';
import { ApostaEsportiva } from './../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apuracao-esporte',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-esporte.component.html',
    styleUrls: ['apuracao-esporte.component.css']
})
export class ApuracaoEsporteComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams;
    smallScreen = true;
    apostas: ApostaEsportiva[] = [];
    modalRef;
    showLoading = true;
    totais = {
        'comissao': 0,
        'valor': 0,
        'premio': 0,
    };
    mjrSports = false;
    encerramentoPermitido;
    modalAposta;
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaService,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        if (window.innerWidth < 669) {
            this.smallScreen = true;
        } else {
            this.smallScreen = false;
        }
        this.encerramentoPermitido = this.paramsLocais.getOpcoes().permitir_encerrar_aposta;
    }

    ngOnChanges() {
        if (location.host.search(/mjrsports/) >= 0) {
            this.mjrSports = true;
        }
        this.showLoading = true;
        this.totais.valor = 0;
        this.totais.premio = 0;
        this.totais.comissao = 0;
        this.getApostas();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getApostas() {
        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'apostador': this.queryParams.apostador,
            'sort': '-horario',
            'otimizado': true
        };

        this.apostaEsportivaService.getApostas(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                apostas => {
                    this.apostas = apostas;
                    apostas.forEach(aposta => {
                        if (!aposta.cartao_aposta) {
                            this.totais.valor += aposta.valor;
                            if (aposta.resultado === 'ganhou') {
                                this.totais.premio += aposta.premio;
                            }
                        }

                        if (this.mjrSports) {
                            this.totais.comissao += aposta.comissao;
                        }
                    });
                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => {
                    this.apostas = [];
                    this.showLoading = false;
                    this.cd.detectChanges();
                    this.handleError(error);
                }
            );
    }


    handleError(msg) {
        this.messageService.error(msg);
    }

    openModal(aposta) {
        this.showLoading = true;
        const params = {};

        if (aposta.id === this.apostas[0].id) {
            params['verificar-ultima-aposta'] = 1;
        }

        let modalAposta;
        if (this.encerramentoPermitido) {
            modalAposta = ApostaEncerramentoModalComponent;
        } else {
            modalAposta = ApostaModalComponent;
        }

        this.apostaService.getAposta(aposta.id, params)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(modalAposta, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        scrollable: true
                    });
                    this.modalRef.componentInstance.aposta = apostaLocalizada;
                    this.modalRef.componentInstance.showCancel = true;
                    if (params['verificar-ultima-aposta']) {
                        this.modalRef.componentInstance.isUltimaAposta = apostaLocalizada.is_ultima_aposta;
                    }

                    this.modalRef.result.then(
                        (result) => {
                            switch (result) {
                                case 'cancel':
                                    this.cancelar(apostaLocalizada);
                                    break;
                                case 'pagamento':
                                    this.pagarAposta(apostaLocalizada);
                                    break;
                                default:
                                    break;
                            }
                        },
                        (reason) => { }
                    );

                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }

    cancelar(aposta) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
        this.modalRef.componentInstance.title = 'Cancelar Aposta';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar a aposta?';

        this.modalRef.result.then(
            (result) => {
                this.apostaService.cancelar({ id: aposta.id, version: aposta.version })
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        () => this.getApostas(),
                        error => this.handleError(error)
                    );
            },
            (reason) => { }
        );
    }

    pagarAposta(aposta) {
        this.apostaService.pagar(aposta.id)
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

    cssResultado(resultado) {
        return {
            'td-ganhou': resultado === 'ganhou',
            'td-perdeu': resultado === 'perdeu',
            'td-pendente': !resultado
        };
    }
}
