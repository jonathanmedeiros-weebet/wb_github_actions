import {
    Component, OnInit, OnDestroy, ChangeDetectionStrategy,
    ChangeDetectorRef, Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaLoteriaModalComponent } from '../../shared/layout/modals';
import { ApostaLoteriaService, MessageService, SorteioService } from './../../services';
import { Aposta, Sorteio } from './../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apuracao-loteria',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apuracao-loteria.component.html',
    styleUrls: ['apuracao-loteria.component.css']
})
export class ApuracaoLoteriaComponent implements OnInit, OnChanges, OnDestroy {
    @Input() queryParams;
    modalRef;
    apostas: Aposta[];
    sorteios: Sorteio[] = [];
    showLoading;
    unsub$ = new Subject();

    constructor(
        private apostaService: ApostaLoteriaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal
    ) { }

    ngOnInit() { }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    ngOnChanges() {
        this.showLoading = true;
        this.getApostas();
        this.getSorteios();
    }

    getSorteios() {
        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'sort': '-data'
        };

        this.sorteioService.getSorteios(queryParams)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios,
                error => this.handleError(error)
            );
    }

    getApostas() {
        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'apostador': this.queryParams.apostador,
            'sort': '-horario'
        };

        this.apostaService.getApostas(queryParams)
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

    abrirBilhete(aposta) {
        this.modalRef = this.modalService.open(ApostaLoteriaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.result.then(
            (result) => { },
            (reason) => { }
        );
    }

    checkResult(numero, sorteioResultado) {
        const result: any = {};

        if (sorteioResultado) {
            const exist = sorteioResultado.find(n => parseInt(n, 10) === numero);

            if (exist) {
                result.hit = true;
            } else {
                result.miss = true;
            }
        }

        return result;
    }
}
