import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ClienteService, MenuFooterService, MessageService, SidebarService, AuthService, ParametrosLocaisService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-pix',
  templateUrl: './perfil-pix.component.html',
  styleUrls: ['./perfil-pix.component.css']
})
export class PerfilPixComponent extends BaseFormComponent implements OnInit {

    showLoading = true;
    mostrarSenha = false;
    googleLogin = false;
    metodoPagamento = '';

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private router: Router,
    ) {
        super();
     }

    ngOnInit(): void {
        const user = this.auth.getUser();
        this.googleLogin = user?.google_login ?? false;

        this.sidebarService.changeItens({contexto: 'cliente'});
        this.metodoPagamento = this.paramsLocais.getOpcoes().api_pagamentos;

        this.createForm();
        this.loadCliente();

        this.menuFooterService.setIsPagina(true);

        if (!this.paramsLocais.getOpcoes().permitir_qualquer_chave_pix) {
            this.router.navigate(['clientes/perfil']);
        }
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

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            chave_pix: [''],
            senha_atual: [null, this.googleLogin ? [] : Validators.required]
        });
    }

    resetarForm() {
        this.showLoading = true;
        this.loadCliente();
    }


    submit() {
        const values = this.form.value;
        let chavePix = this.form.value['chave_pix'];

        if(chavePix.match(/@/)){
            this.form.value['chave_pix'] = chavePix.toLowerCase().trim();
        }

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
    handleError(error: string) {
        this.messageService.error(error);
    }

}
