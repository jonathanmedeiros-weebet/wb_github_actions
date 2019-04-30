import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { PinValidation } from '../../../utils';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';

@Component({
    selector: 'app-cartao-cadastro-modal',
    templateUrl: './cartao-cadastro-modal.component.html'
})
export class CartaoCadastroModalComponent extends BaseFormComponent implements OnInit {
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
            apostador: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ])],
            valor: [null, Validators.required],
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
        this.cartaoService.create(this.form.value)
            .subscribe(
                result => {
                    this.modalRef = this.modalService.open(CartaoModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.cartao = result;
                    this.message.success('Cartão de Aposta cadastrado com sucesso.');
                    this.activeModal.close();
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.message.error(error);
    }
}
