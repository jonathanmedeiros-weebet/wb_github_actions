import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input, OnChanges
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaAcumuladaoModalComponent, ConfirmModalComponent } from '../../shared/layout/modals';
import { AcumuladaoService, ApostaService, MessageService, AuthService } from './../../services';
import { AcumuladaoAposta } from './../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apuracao-acumuladao',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-acumuladao.component.html',
    styleUrls: ['apuracao-acumuladao.component.css']
})
export class ApuracaoAcumuladaoComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams;
    apostas: AcumuladaoAposta[] = [];
    modalRef;
    showLoading = true;
    unsub$ = new Subject();

    constructor(
        private acumuladaoService: AcumuladaoService,
        private apostaServive: ApostaService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal
    ) {
    }

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
        const queryParams = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'apostador': this.queryParams.apostador,
            'sort': '-horario'
        };

        this.acumuladaoService.getApostas(queryParams)
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

        this.showLoading = false;
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
                        () => this.getApostas(),
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

    cssResultado(resultado) {
        return {
            'td-ganhou': resultado === 'ganhou',
            'td-perdeu': resultado === 'perdeu',
            'td-pendente': !resultado
        };
    }
}
