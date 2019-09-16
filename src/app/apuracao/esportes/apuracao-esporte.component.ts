import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy,
    Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaModalComponent, ConfirmModalComponent } from '../../shared/layout/modals';
import { ApostaEsportivaService, ApostaService, MessageService, AuthService } from './../../services';
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
    apostas: ApostaEsportiva[] = [];
    modalRef;
    showLoading = true;
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaService,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private auth: AuthService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal
    ) { }

    ngOnInit() { }

    ngOnChanges() {
        this.showLoading = true;
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
                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => this.handleError(error)
            );
    }


    handleError(msg) {
        this.messageService.error(msg);
    }

    openModal(aposta) {
        this.showLoading = true;

        this.apostaService.getAposta(aposta.id, { 'verificar-ultima-aposta': 1 })
            .subscribe(
                aposta_localizada => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.aposta = aposta_localizada;
                    this.modalRef.componentInstance.showCancel = true;
                    this.modalRef.componentInstance.ultimaAposta = aposta_localizada.ultima_aposta;

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
                this.apostaService.cancelar(aposta.id)
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
}
