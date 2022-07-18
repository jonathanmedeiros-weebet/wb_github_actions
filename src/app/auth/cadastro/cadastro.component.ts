import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormValidations, PasswordValidation} from '../../shared/utils';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {Pagina} from '../../shared/models/pagina';
import {AuthService} from '../../shared/services/auth/auth.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import * as moment from 'moment';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent extends BaseFormComponent implements OnInit, OnDestroy {
    type = 'password';
    icon = 'fa fa-eye';
    termosDeUso: Pagina;
    submitting = false;
    debouncer: any;
    afiliadoHabilitado;

    constructor(
        private fb: FormBuilder,
        private clientesService: ClienteService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private auth: AuthService,
        private menuFooterService: MenuFooterService,
        private paramsService: ParametrosLocaisService,
        private route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
        this.clientesService.getTermosDeUso().subscribe(
            (termos: Pagina) => {
                this.termosDeUso = termos ? termos : new Pagina();
            },
            error => this.handleError(error)
        );
        this.menuFooterService.setIsPagina(true);
        this.afiliadoHabilitado = this.paramsService.getOpcoes().afiliado;

        this.route.queryParams
            .subscribe((params) => {
            if (params.afiliado) {
                    this.form.get('afiliado').patchValue(params.afiliado);
                }
        });
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            sobrenome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            usuario: [null, [
                    Validators.minLength(3),
                    Validators.pattern('^[a-zA-Z0-9_]+$'),
                    Validators.required
                ], this.validarLoginUnico.bind(this)],
            nascimento: [null, [Validators.required, FormValidations.birthdayValidator]],
            senha: [null, [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(3)]],
            cpf: [null, [Validators.required]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required]],
            genero: ['', [Validators.required]],
            afiliado: [null, [Validators.maxLength(50)]],
            aceitar_termos: [null, [Validators.required]]
        }, {validator: PasswordValidation.MatchPassword});
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

    validarLoginUnico(control: AbstractControl) {
        clearTimeout(this.debouncer);
        return new Promise(resolve => {
            this.debouncer = setTimeout(() => {
                this.clientesService.verificarLogin(control.value).subscribe((res) => {
                    if (res) {
                        resolve(null);
                    }
                }, () => {
                    resolve({'loginEmUso': true});
                });
            }, 1000);
        });
    }

    submit() {
        const values = this.form.value;
        values.nascimento = moment(values.nascimento, 'DDMMYYYY', true).format('YYYY-MM-DD');

        this.submitting = true;
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
                error => {
                    this.messageService.error(error);
                    this.submitting = false;
                }
            );
    }

}
