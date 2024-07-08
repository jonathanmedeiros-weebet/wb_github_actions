import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Input,
    OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {MessageService} from './../../../services';
import {ApostaCasino} from './../../../models';
import {CasinoApiService} from '../../../shared/services/casino/casino-api.service';

@Component({
    selector: 'app-apostas-cliente-casino',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apostas-cliente-casino.component.html',
    styleUrls: ['apostas-cliente-casino.component.css']
})
export class ApostasClienteCasinoComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams;
    smallScreen = true;
    apostas: ApostaCasino[] = [];
    modalRef;
    showLoading = true;
    totais = {
        'valor': 0,
        'premio': 0,
    };
    unsub$ = new Subject();

    constructor(
        private apostaCasinoService: CasinoApiService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
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

        this.apostaCasinoService.getApostas(queryParams)
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

    trackById(index: number, aposta: any): string {
        return aposta.id;
    }

    cssResultado(resultado) {
        return {
            'td-ganhou': resultado === 'ganhou',
            'td-perdeu': resultado === 'perdeu',
            'td-pendente': resultado === 'reembolso'
        };
    }
}
