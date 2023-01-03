import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Router } from '@angular/router';

import {config} from '../../../config';

@Component({
    selector: 'app-esqueceu-senha-modal',
    templateUrl: './esqueceu-senha-modal.component.html',
    styleUrls: ['./esqueceu-senha-modal.component.css']
})
export class EsqueceuSenhaModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    appMobile;
    unsub$ = new Subject();
    submitting = false;
    LOGO = config.LOGO;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.appMobile = this.auth.isAppMobile();
    }

    createForm() {
        this.form = this.fb.group({
            email: [null, [Validators.required]]
        });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        this.submitting = true;
        this.auth.forgot(this.form.value)
            .subscribe(
                () => {
                    this.activeModal.dismiss();
                    this.messageService.success('O código de verificação foi enviado para o e-mail informado.');
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
