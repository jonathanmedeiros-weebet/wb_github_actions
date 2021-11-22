import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input, OnChanges
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApostaModalComponent, ConfirmModalComponent } from '../../../shared/layout/modals';
import { AcumuladaoService, ApostaService, MessageService } from './../../../services';
import { AcumuladaoAposta } from './../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-apostas-cliente-acumuladao',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'apostas-cliente-acumuladao.component.html',
    styleUrls: ['apostas-cliente-acumuladao.component.css']
})
export class ApostasClienteAcumuladaoComponent implements OnInit, OnDestroy, OnChanges {
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

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
        this.modalRef.componentInstance.aposta = aposta;
        if (aposta.id === this.apostas[0].id) {
            this.modalRef.componentInstance.isUltimaAposta = true;
        }

        this.showLoading = false;
        this.cd.detectChanges();
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
