import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, MessageService } from './../../../../services';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';

@Component({
    selector: 'app-pesquisar-cartao-modal',
    templateUrl: './pesquisar-cartao-modal.component.html'
})
export class PesquisarCartaoModalComponent implements OnInit, OnDestroy {
    modalRef;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['', Validators.required]
    });
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private cartaoService: CartaoService,
        private messageService: MessageService
    ) { }

    ngOnInit() { }


    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    pesquisarCartao() {
        if (this.pesquisarForm.valid) {
            const input = this.pesquisarForm.value.input;

            this.cartaoService.getCartao(input)
                .pipe(takeUntil(this.unsub$))
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
    }

}
