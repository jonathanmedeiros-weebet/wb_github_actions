import { ImagensService } from './../../../services/utils/imagens.service';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, PrintService, HelperService } from '../../../../services';
import { toPng } from 'html-to-image';
import { config } from '../../../config';

@Component({
    selector: 'app-recarga-success-modal',
    templateUrl: './recarga-success-modal.component.html',
    styleUrls: ['./recarga-success-modal.component.css']
})
export class RecargaSuccessModalComponent implements OnInit {
    @ViewChild('cupom', { static: false }) cupom: ElementRef;
    @Input() recarga;
    BANCA_NOME;
    appMobile;
    LOGO;

    constructor(
        public activeModal: NgbActiveModal,
        private auth: AuthService,
        private printService: PrintService,
        private helper: HelperService,
        private imagensService: ImagensService
    ) { }

    ngOnInit() {
        this.BANCA_NOME = config.BANCA_NOME;
        this.appMobile = this.auth.isAppMobile();
        this.LOGO = this.imagensService.logo;
    }

    printTicket() {
        this.printService.comprovanteRecarga(this.recarga);
    }

    shareTicket() {
        toPng(this.cupom.nativeElement).then((dataUrl) => {
            this.helper.sharedRecargaCartao(this.recarga, dataUrl);
        });
    }
}
