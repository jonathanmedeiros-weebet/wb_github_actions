import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService, MessageService, UtilsService, MenuFooterService, SidebarService } from 'src/app/services';
import { Cidade } from 'src/app/shared/models/endereco/cidade';
import { Estado } from 'src/app/shared/models/endereco/estado';
import { BaseFormComponent } from '../../base-form/base-form.component';

import * as moment from 'moment';
import { Endereco } from 'src/app/shared/models/endereco/endereco';


@Component({
    selector: 'app-cliente-pix-modal',
    templateUrl: './cliente-pix-modal.component.html',
    styleUrls: ['./cliente-pix-modal.component.css']
})
export class ClientePixModalComponent extends BaseFormComponent implements OnInit {
    estados: Array<Estado>;
    cidades: Array<Cidade>;
    estadoSelecionado: number;
    cidadeSelecionada: number;
    showLoading = true;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.loadCliente();
    }

    createForm() {
        this.form = this.fb.group({
            chave_pix: [''],
            senha_atual: [null, Validators.required]
        });
    }

    submit() {
        const values = this.form.value;
        this.clienteService.atualizarPix(values)
            .subscribe(
                () => {
                    this.messageService.success('Dados Cadastrais atualizados.');
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    loadCliente() {
        const user = JSON.parse(localStorage.getItem('user'));

        this.clienteService
            .getCliente(user.id)
            .subscribe(
                cliente => {
                    this.form.patchValue({
                        chave_pix: cliente.chave_pix
                    });

                    this.showLoading = false;
                },
                error => {
                    this.handleError('Algo inesperado aconteceu. Tente novamente mais tarde.');
                }
            );
    }

    resetarForm() {
        this.showLoading = true;
        this.loadCliente();
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
