import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from '../../../../services';
import * as html2canvas from 'html2canvas';

@Component({
    selector: 'app-recarga-success-modal',
    templateUrl: './recarga-success-modal.component.html',
    styleUrls: ['./recarga-success-modal.component.css']
})
export class RecargaSuccessModalComponent implements OnInit {
    @ViewChild('cupom') cupom: ElementRef;
    @Input() recarga;
    appMobile;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
        private helper: HelperService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    printTicket() {
        this.printService.comprovanteRecarga(this.recarga);
    }

    shareTicket() {
        const options = { logging: false };

        html2canvas(this.cupom.nativeElement, options).then((canvas) => {
            this.helper.sharedRecargaCartao(this.recarga, canvas.toDataURL());
        });
    }
}
