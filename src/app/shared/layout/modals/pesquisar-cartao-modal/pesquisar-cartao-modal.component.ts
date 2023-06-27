import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';


import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-pesquisar-cartao-modal',
    templateUrl: './pesquisar-cartao-modal.component.html',
    styleUrls: ['./pesquisar-cartao-modal.component.css']
})
export class PesquisarCartaoModalComponent extends BaseFormComponent implements OnInit {
    modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private modalService: NgbModal,
        private cartaoService: CartaoService,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            chave: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])]
        });
    }

    submit() {
        this.cartaoService.getCartao(this.form.value)
            .subscribe(
                cartao => {
                    this.modalRef = this.modalService.open(CartaoModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.cartao = cartao;
                    this.activeModal.close();
                },
                error => this.messageService.error(error)
            );
    }

    handleError(error) {
        this.messageService.error(error);
    }
}
