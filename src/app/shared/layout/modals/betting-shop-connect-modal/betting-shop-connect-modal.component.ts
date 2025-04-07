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
            bettingShopCode: [null, [Validators.required]]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.submitting = true;
        const bettingShopCode = this.form.get('bettingShopCode').value;

        this.validateBettingShop(bettingShopCode);
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    private validateBettingShop(code) {
        this.bettingShopService.verifyAndGetBettingShop(code).subscribe({
            next: (res) => {
                if (res) {
                    localStorage.setItem('bettingShopCode', code);

                    this.messageService.success('Conectado ao ponto de venda com sucesso!');
                    this.submitting = false;
                    this.activeModal.close();
                    this.router.navigate(['']);
                }
            },
            error: (err) => {
                const errorMessage = err?.error?.errors?.message || 'Erro desconhecido';
                this.handleError(errorMessage);
                this.submitting = false;
            },
        });
    }
}
