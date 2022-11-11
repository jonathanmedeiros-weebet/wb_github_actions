import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from '../../../../services';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-pesquisar-cartao-mobile-modal',
    templateUrl: './pesquisar-cartao-mobile-modal.component.html',
    styleUrls: ['./pesquisar-cartao-mobile-modal.component.css']
})
export class PesquisarCartaoMobileModalComponent extends BaseFormComponent implements OnInit {
    modalRef;

    cartao;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
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
                    console.log(cartao)
                    this.cartao = cartao;
                },
                error => this.messageService.error(error)
            );
    }

    abrirDetalheCartao(cartao) {
        this.modalRef = this.modalService.open(CartaoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
        this.modalRef.componentInstance.cartao = cartao;
    }

    handleError(error) {
        this.messageService.error(error);
    }
}
