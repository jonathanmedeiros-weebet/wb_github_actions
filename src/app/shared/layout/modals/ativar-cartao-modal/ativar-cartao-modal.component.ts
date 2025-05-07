import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';
import { PinValidation } from '../../../utils';
import clone from 'clone';

@Component({
    selector: 'app-ativar-cartao-modal',
    templateUrl: './ativar-cartao-modal.component.html'
})
export class AtivarCartaoModalComponent extends BaseFormComponent implements OnInit {
    modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private fb: UntypedFormBuilder,
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
            apostador: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ])],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(6)
            ])],
            pin_confirmacao: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(6),
            ])],
        }, { validator: PinValidation.MatchPin });
    }

    submit() {
        const values = clone(this.form.value);
        const chave = values.chave;
        delete values.chave;

        this.cartaoService.ativar(chave, values)
            .subscribe(
                result => {
                    this.modalRef = this.modalService.open(CartaoModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.cartao = result;
                    this.message.success('Cartão de Aposta <b>ativado</b> com sucesso.');
                    this.activeModal.close();
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.message.error(error);
    }
}
