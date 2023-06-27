import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-solicitar-saque-modal',
    templateUrl: './solicitar-saque-modal.component.html',
    styleUrls: ['./solicitar-saque-modal.component.css']
})
export class SolicitarSaqueModalComponent extends BaseFormComponent implements OnInit {
    modalRef;
    mobileScreen;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private cartaoService: CartaoService,
        private message: MessageService
    ) {
        super();
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            chave: [null, Validators.required],
            valor: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])]
        });
    }

    submit() {
        this.cartaoService.solicitarSaque(this.form.value)
            .subscribe(
                result => {
                    this.message.success('Solicitação de saque realizada com sucesso!');
                    this.activeModal.close();
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.message.error(error);
    }

}
