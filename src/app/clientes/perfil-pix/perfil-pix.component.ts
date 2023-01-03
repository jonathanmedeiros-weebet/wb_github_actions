import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClienteService, MenuFooterService, MessageService, SidebarService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';

@Component({
  selector: 'app-perfil-pix',
  templateUrl: './perfil-pix.component.html',
  styleUrls: ['./perfil-pix.component.css']
})
export class PerfilPixComponent extends BaseFormComponent implements OnInit {

    showLoading = true;
    mostrarSenha = false;

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
    ) {
        super();
     }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cliente'});

        this.createForm();
        this.loadCliente();

        this.menuFooterService.setIsPagina(true);
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
            senha_atual: [null, Validators.required]
        });
    }

    resetarForm() {
        this.showLoading = true;
        this.loadCliente();
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
    handleError(error: string) {
        this.messageService.error(error);
    }

}
