import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy,
    Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaModalComponent, ConfirmModalComponent } from '../../shared/layout/modals';
import { DesafioApostaService, ApostaService, MessageService, AuthService } from '../../services';
import { DesafioAposta } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apuracao-desafio',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-desafio.component.html',
    styleUrls: ['apuracao-desafio.component.css']
})
export class ApuracaoDesafioComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams;
    smallScreen = true;
    apostas: DesafioAposta[] = [];
    modalRef;
    showLoading = true;
    totais = {
        'comissao': 0,
        'valor': 0,
        'premio': 0,
    };
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaService,
        private desafioApostaService: DesafioApostaService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        if (window.innerWidth < 669) {
            this.smallScreen = true;
        } else {
            this.smallScreen = false;
        }
    }

    ngOnChanges() {
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

        this.desafioApostaService.getApostas(queryParams)
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
                    });
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
                result => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.aposta = result;
                    this.modalRef.componentInstance.showCancel = true;
                    this.modalRef.componentInstance.isUltimaAposta = result.is_ultima_aposta;

                    this.modalRef.result.then(
                        (result) => {
                            switch (result) {
                                case 'cancel':
                                    this.cancelar(aposta);
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
