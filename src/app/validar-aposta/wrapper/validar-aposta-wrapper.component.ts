import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    MessageService,
    PreApostaEsportivaService
} from '../../services';
import { ApostaModalComponent } from './../../shared/layout/modals/aposta-modal/aposta-modal.component';
import { ApostaLoteriaModalComponent } from './../../shared/layout/modals/aposta-loteria-modal/aposta-loteria-modal.component';
import { ApostaAcumuladaoModalComponent } from './../../shared/layout/modals/aposta-acumuladao-modal/aposta-acumuladao-modal.component';

@Component({
    selector: 'app-validar-aposta-wrapper',
    templateUrl: 'validar-aposta-wrapper.component.html',
    styleUrls: ['./validar-aposta-wrapper.component.css']
})
export class ValidarApostaWrapperComponent implements OnInit, OnDestroy {
    codigo: any;
    showLoadingIndicator = false;
    exibirPreAposta = false;
    preAposta: any;
    modalRef;
    unsub$ = new Subject();

    constructor(
        private preApostaService: PreApostaEsportivaService,
        private messageService: MessageService,
        private elRef: ElementRef,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    consultarAposta() {
        this.showLoadingIndicator = true;
        this.exibirPreAposta = false;

        this.preApostaService
            .getPreAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                preAposta => {
                    this.exibirPreAposta = true;
                    this.preAposta = preAposta;
                    this.showLoadingIndicator = false;
                },
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.showLoadingIndicator = false;
        this.messageService.error(msg);
    }

    success(aposta) {
        this.goToTop('#default-content');

        let modalComponent;
        if (aposta.tipo === 'esportes') {
            modalComponent = ApostaModalComponent;
        }
        if (aposta.tipo === 'loteria') {
            modalComponent = ApostaLoteriaModalComponent;
        }
        if (aposta.tipo === 'acumuladao') {
            modalComponent = ApostaAcumuladaoModalComponent;
        }

        this.modalRef = this.modalService.open(modalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
    }

    goToTop(selector) {
        const content = this.elRef.nativeElement.querySelector(selector);
        content.scrollTop = 0;
    }
}
