import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService, MessageService, UtilsService, AuthService, SidebarService } from 'src/app/services';
import { Cidade } from 'src/app/shared/models/endereco/cidade';
import { Estado } from 'src/app/shared/models/endereco/estado';
import { BaseFormComponent } from '../../base-form/base-form.component';

import * as moment from 'moment';
import { Endereco } from 'src/app/shared/models/endereco/endereco';
import { Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { PasswordValidation } from 'src/app/shared/utils';


@Component({
    selector: 'app-cliente-senha-modal',
    templateUrl: './cliente-senha-modal.component.html',
    styleUrls: ['./cliente-senha-modal.component.css']
})
export class ClienteSenhaModalComponent extends BaseFormComponent implements OnInit {
    public isCollapsed = false;
    unsub$ = new Subject();
    isCliente;

    mostrarSenhaAtual = false;
    mostrarSenhaNova = false;
    mostrarSenhaConfirmacao = false;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private auth: AuthService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.isCliente = this.auth.isCliente();
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: ['', Validators.required],
            senha_nova: ['', [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: ['', [Validators.required, Validators.minLength(3)]]
        }, {validator: PasswordValidation.MatchPassword});
    }

    submit() {
        const values = this.form.value;

        this.clienteService.alterarSenha(values)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                res => {
                    this.form.reset();
                    this.handleSuccess();
                },
                error => this.handleError(error)
            );
    }

    resetarForm() {
        this.form.reset();
    }

    handleSuccess() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
