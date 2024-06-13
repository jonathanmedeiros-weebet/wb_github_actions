import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef,
    NgModule
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    MenuFooterService,
    MessageService,
    SidebarService,
    ApostaLoteriaService
} from '../../services';
import { ApostaModalComponent } from './../../shared/layout/modals';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {Aposta} from "../../shared/models/loteria/aposta";

@Component({
    selector: 'app-copiar-aposta-wrapper',
    templateUrl: 'copiar-aposta-wrapper.component.html',
    styleUrls: ['./copiar-aposta-wrapper.component.css']
})
export class CopiarApostaWrapperComponent extends BaseFormComponent implements OnInit, OnDestroy {
    codigo: any;
    showLoadingIndicator = false;
    exibirPreAposta = false;
    preAposta: any;
    modalRef;
    unsub$ = new Subject();
    mobileScreen;

    constructor(
        private copiarApostaService: ApostaLoteriaService,
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private elRef: ElementRef,
        private modalService: NgbModal,
        private fb: UntypedFormBuilder,
        private menuFooterService: MenuFooterService,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <=1024;
        this.createForm();
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cambista'});
            this.menuFooterService.setIsPagina(true);
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    submit() {
        this.showLoadingIndicator = true;
        this.exibirPreAposta = false;

        this.copiarApostaService
            .getApostaCopiar(this.codigo)
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

        this.modalRef = this.modalService.open(ApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            scrollable: true
        });

        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.primeiraImpressao = true;
    }

    goToTop(selector) {
        const content = this.elRef.nativeElement.querySelector(selector);
        content.scrollTop = 0;
    }

    createForm() {
        this.form = this.fb.group({
            codigo: ['', Validators.compose([
                Validators.required
            ])]
        });
    }
}
