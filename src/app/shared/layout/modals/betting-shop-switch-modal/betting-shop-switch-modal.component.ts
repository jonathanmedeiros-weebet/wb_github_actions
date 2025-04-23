import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from 'base-build/config';
import { BettingShopConnectModalComponent } from '../betting-shop-connect-modal/betting-shop-connect-modal.component';

@Component({
    selector: 'app-betting-shop-switch-modal',
    templateUrl: './betting-shop-switch-modal.component.html',
    styleUrls: ['./betting-shop-switch-modal.component.css']
})
export class BettingShopSwitchModalComponent implements OnInit {
    public SLUG = '';

    constructor(
        private activeModal: NgbActiveModal,
        public modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.SLUG = config.SLUG;
    }

    public continueToHome() {
        this.activeModal.dismiss();
    }

    public continueToReconnect() {
        this.activeModal.dismiss();
        localStorage.removeItem('bettingShopId');
        localStorage.removeItem('bettingShopCode');
        this.modalService.open(
            BettingShopConnectModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-lg-custom',
                centered: true,
                backdrop: 'static',
            }
        )
    }
}
