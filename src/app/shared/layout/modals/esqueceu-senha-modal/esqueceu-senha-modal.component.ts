import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService } from './../../../../services';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { Router } from '@angular/router';

import {config} from '../../../config';
import { RegisterModalComponentComponent } from '../register-modal/register-modal-component/register-modal-component.component';

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
    modalRef;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private auth: AuthService,
        private router: Router,
        private modalService: NgbModal,
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
        let emailSemEspaco = this.form.value['email'].trim();
        let email = {
            "email": emailSemEspaco
        }
        this.auth.forgot(email)
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

    abrirCadastro() {
            this.activeModal.dismiss();
    
            this.modalRef = this.modalService.open(
                RegisterModalComponentComponent,
                {
                    ariaLabelledBy: 'modal-basic-title',
                    size: 'md',
                    centered: true,
                    windowClass: 'modal-400 modal-cadastro-cliente'
                }
            );
        }
}
