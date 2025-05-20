import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
    selector: 'app-account-verified-address',
    templateUrl: './account-verified-address.component.html',
    styleUrls: ['./account-verified-address.component.scss']
})
export class AccountVerifiedAddressComponent {

    constructor(
        private activeModal: NgbActiveModal,
        private router: Router
    ) {}

    public goToAccountVerification() {
        this.router.navigate(['clientes/personal-data'], {queryParams: { openAddressAccordion: true }});
        this.activeModal.close(true);
    }

    onClick() {
        this.activeModal.close(false);
    }
}
