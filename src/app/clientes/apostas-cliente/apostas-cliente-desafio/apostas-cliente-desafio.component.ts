import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy,
    Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaModalComponent, ConfirmModalComponent } from '../../../shared/layout/modals';
import { DesafioApostaService, ApostaService, MessageService, AuthService } from '../../../services';
import { DesafioAposta } from '../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apostas-cliente-desafio',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apostas-cliente-desafio.component.html',
    styleUrls: ['apostas-cliente-desafio.component.css']
})
export class ApostasClienteDesafioComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams;
    smallScreen = true;
    apostas: DesafioAposta[] = [];
    modalRef;
    showLoading = true;
    totais = {
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
        const params = {};

        if (aposta.id === this.apostas[0].id) {
            params['verificar-ultima-aposta'] = 1;
        }

        this.apostaService.getAposta(aposta.id, params)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.aposta = apostaLocalizada;
                    this.modalRef.componentInstance.showCancel = true;
                    if (params['verificar-ultima-aposta']) {
                        this.modalRef.componentInstance.isUltimaAposta = apostaLocalizada.is_ultima_aposta;
                    }

                    this.showLoading = false;
                    this.cd.detectChanges();
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
