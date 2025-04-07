import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services';
import { BettingShopService } from 'src/app/shared/services/betting-shop.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-betting-shop-connect-modal',
    templateUrl: './betting-shop-connect-modal.component.html',
    styleUrls: ['./betting-shop-connect-modal.component.css']
})
export class BettingShopConnectModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public unsub$ = new Subject();
    public submitting = false;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private bettingShopService: BettingShopService,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            bettingShopId: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
            bettingShopCode: [null, [Validators.required]]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.submitting = true;
        const bettingShopId = this.form.get('bettingShopId').value;
        const bettingShopCode = this.form.get('bettingShopCode').value;

        this.validateBettingShop(bettingShopId, bettingShopCode);
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    private validateBettingShop(id, code) {
        this.bettingShopService.verifyAndGetBettingShop(id, code).subscribe({
            next: (res) => {
                if (res) {
                    localStorage.setItem('bettingShopId', id);
                    localStorage.setItem('bettingShopeCode', code);
                }

                this.submitting = false;
                this.activeModal.close();
            },
            error: (err) => {
                const errorMessage = err?.error?.errors?.message || 'Erro desconhecido';
                this.handleError(errorMessage);
                this.submitting = false;
            },
        });
    }
}
