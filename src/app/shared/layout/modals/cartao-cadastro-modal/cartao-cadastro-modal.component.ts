import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartaoService, AuthService, MessageService } from './../../../../services';
import { CartaoAposta } from './../../../../models';
import { PinValidation } from '../../../utils';
import { BaseFormComponent } from '../../base-form/base-form.component';

@Component({
    selector: 'app-cartao-cadastro-modal',
    templateUrl: './cartao-cadastro-modal.component.html',
    styleUrls: ['./cartao-cadastro-modal.component.css']
})
export class CartaoCadastroModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    form: FormGroup;
    showForm = true;
    appMobile;
    cartao: CartaoAposta;
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private cartaoService: CartaoService,
        private message: MessageService,
        private auth: AuthService
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.createForm();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
            valor: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
            pin_confirmacao: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
        }, { validator: PinValidation.MatchPin });
    }

    submit() {
        this.cartaoService.create(this.form.value)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                result => {
                    this.showForm = false;
                    this.cartao = result;
                    this.message.success('Cartão de Aposta cadastrado com sucesso.');
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.message.error(error);
    }

    print() {

    }

    shared() {

    }
}
