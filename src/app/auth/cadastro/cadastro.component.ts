import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {FormValidations} from '../../shared/utils';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {Pagina} from '../../shared/models/pagina';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth/auth.service';
import {delay} from 'lodash';

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent extends BaseFormComponent implements OnInit {
    type: string = 'password';
    icon: string = 'fa fa-eye';
    termosDeUso: Pagina;

    constructor(
        private fb: FormBuilder,
        private clientesService: ClienteService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private auth: AuthService,
        private route: Router,
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
        this.clientesService.getTermosDeUso().subscribe(
            (termos: Pagina) => {
                (termos) ? this.termosDeUso = termos : this.handleError('Termos de uso Indisponível.', 'warning');
            },
            error => this.handleError(error)
        );
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            usuario: [null, [
                    Validators.minLength(3),
                    Validators.pattern('[a-zA-Z]*'),
                    Validators.required
                ], this.clientesService.validarLoginUnico.bind(this.clientesService)],
            nascimento: [null, [Validators.required]],
            senha: [null, [Validators.required]],
            senha_confirmacao: [null, [Validators.required, FormValidations.equalsTo('senha')]],
            cpf: [null, [Validators.required]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required]],
            genero: ['', [Validators.required]],
            aceitar_termos: [null, [Validators.required]]
        });
    }

    showPassword(type: string) {
        if (type === 'password') {
            this.type = 'text';
            this.icon = 'fa fa-eye-slash';
        } else {
            this.type = 'password';
            this.icon = 'fa fa-eye';
        }
    }

    abrirModalTermosUso(modal: any) {
        if (this.termosDeUso) {
            this.modalService.open(modal);
        }
    }

    handleError(message: string, type?: string) {
        if (type) {
            if (type === 'warning') {
                this.messageService.warning(message);
            }
        } else {
            this.messageService.error(message);
        }
    }

    submit() {
        const values = this.form.value;
        this.clientesService.cadastrarCliente(values)
            .subscribe(
                () => {
                    this.auth.login({username: values.usuario, password: values.senha}).subscribe(
                        () => {
                            this.messageService.success('Cadastro realizado com sucesso!');
                        },
                        error => this.messageService.error(error)
                    );
                },
                error => this.messageService.error(error)
            );
    }

}
