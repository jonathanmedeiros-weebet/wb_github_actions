import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { PinValidation } from '../../../utils';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';

@Component({
    selector: 'app-cartao-cadastro-modal',
    templateUrl: './cartao-cadastro-modal.component.html',
    styleUrls: ['./cartao-cadastro-modal.component.css']
})
export class CartaoCadastroModalComponent extends BaseFormComponent implements OnInit {
    modalRef;
    disabled = false;
    mobileScreen;

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
        this.mobileScreen = window.innerWidth <=1024;
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
        this.disabled = true;

        this.cartaoService.create(this.form.value)
            .subscribe(
                result => {
                    this.disabled = false;
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
        this.disabled = false;
    }
}
