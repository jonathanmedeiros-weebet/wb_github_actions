import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApostaService, AuthService, ClienteService, MessageService, ParametrosLocaisService} from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';

@Component({
    selector: 'app-resgatar-cupom-modal',
    templateUrl: './resgatar-cupom-modal.component.html',
    styleUrls: ['./resgatar-cupom-modal.component.css']
})
export class ResgatarCupomModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    disabled = false;

    appMobile;
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private clientesService: ClienteService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            codigo: ['', Validators.compose([
                Validators.required
            ])]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.clientesService.resgatarCupom(this.form.value)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => {
                    this.form.reset();
                    this.messageService.success(res.mensagem);
                    this.activeModal.close();
                },
                error => this.messageService.error(error)
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
