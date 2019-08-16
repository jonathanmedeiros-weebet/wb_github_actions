import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, ApostaService, MessageService } from './../../../../services';
import { CartaoAposta } from './../../../../models';
import { ApostaModalComponent } from '../../../layout/modals/aposta-modal/aposta-modal.component';

@Component({
    selector: 'app-cartao-modal',
    templateUrl: './cartao-modal.component.html',
    styleUrls: ['./cartao-modal.component.css']
})
export class CartaoModalComponent implements OnInit {
    @Input() cartao: CartaoAposta = new CartaoAposta();
    appMobile;
    modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        private auth: AuthService,
        private printService: PrintService,
        private apostaService: ApostaService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    print() {
        this.printService.card(this.cartao);
    }

    abrirBilhete(id) {
        this.apostaService.getAposta(id)
            .subscribe(
                aposta_localizada => {
                    this.modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    });
                    this.modalRef.componentInstance.aposta = aposta_localizada;
                    this.modalRef.componentInstance.showCancel = true;
                    this.modalRef.result.then(
                        (result) => { },
                        (reason) => { }
                    );
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.messageService.error(error);
    }
}
