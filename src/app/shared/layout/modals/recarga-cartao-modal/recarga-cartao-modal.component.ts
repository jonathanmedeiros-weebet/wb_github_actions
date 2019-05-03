import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { RecargaSuccessModalComponent } from '../recarga-success-modal/recarga-success-modal.component';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-recarga-cartao-modal',
    templateUrl: './recarga-cartao-modal.component.html',
    styleUrls: ['./recarga-cartao-modal.component.css']
})
export class RecargaCartaoModalComponent extends BaseFormComponent implements OnInit {
    modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cartaoService: CartaoService,
        private message: MessageService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            chave: [null, Validators.required],
            valor: [null, Validators.compose([
                Validators.required,
                Validators.min(1)
            ])]
        });
    }

    submit() {
        const values = this.form.value;
        this.cartaoService.recarga(values.chave, values.valor)
            .subscribe(
                result => {
                    this.modalRef = this.modalService.open(RecargaSuccessModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.recarga = result;
                    this.activeModal.close();
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.message.error(error);
    }
}
