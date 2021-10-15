import {
    Component, OnInit, OnDestroy, ChangeDetectionStrategy,
    ChangeDetectorRef, Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaModalComponent, ConfirmModalComponent } from '../../../shared/layout/modals';
import { ApostaService, ApostaLoteriaService, MessageService, SorteioService } from './../../../services';
import { Aposta, Sorteio } from './../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apostas-cliente-loteria',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apostas-cliente-loteria.component.html',
    styleUrls: ['apostas-cliente-loteria.component.css']
})
export class ApostasClienteLoteriaComponent implements OnInit, OnChanges, OnDestroy {
    @Input() queryParams;
    modalRef;
    apostas: Aposta[];
    sorteios: Sorteio[] = [];
    showLoading;
    unsub$ = new Subject();

    constructor(
        private apostaLoteriaService: ApostaLoteriaService,
        private apostaService: ApostaService,
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
            'sort': '-horario'
        };

        this.apostaLoteriaService.getApostas(queryParams)
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
        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.showCancel = true;
        this.modalRef.componentInstance.aposta = aposta;
        if (aposta.id === this.apostas[0].id) {
            this.modalRef.componentInstance.isUltimaAposta = true;
        }
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
