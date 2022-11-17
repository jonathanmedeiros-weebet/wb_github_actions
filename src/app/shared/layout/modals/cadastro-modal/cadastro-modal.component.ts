import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService, ClienteService } from './../../../../services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Usuario} from '../../../models/usuario';
import { FormValidations, PasswordValidation } from 'src/app/shared/utils';

import * as moment from 'moment';
import { Pagina } from 'src/app/models';
import {config} from '../../../config';


@Component({
    selector: 'app-cadastro-modal',
    templateUrl: './cadastro-modal.component.html',
    styleUrls: ['./cadastro-modal.component.css']
})
export class CadastroModalComponent extends BaseFormComponent implements OnInit, OnDestroy {
    appMobile;
    unsub$ = new Subject();
    usuario = new Usuario();
    termosDeUso: Pagina;
    debouncer: any;
    submitting = false;
    afiliadoHabilitado;
    isCliente;
    isLoggedIn;
    mostrarSenha;
    mostrarConfirmarSenha;
    LOGO = config.LOGO;
    modalTermosRef;

    constructor(
        public activeModal: NgbActiveModal,
        private clientesService: ClienteService,
        private fb: FormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.createForm();

        this.clientesService.getTermosDeUso().subscribe(
            (termos: Pagina) => {
                this.termosDeUso = termos ? termos : new Pagina();
            },
            error => this.handleError(error)
        );

        this.afiliadoHabilitado = this.paramsService.getOpcoes().afiliado;

        this.route.queryParams
            .subscribe((params) => {
            if (params.afiliado) {
                sessionStorage.setItem('afiliado', params.afiliado);
            }
             this.form.get('afiliado').patchValue(sessionStorage.getItem('afiliado'));
        });
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
            senha: [null, [Validators.required, Validators.minLength(6)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(6)]],
            cpf: [null, [Validators.required]],
            telefone: [null, [Validators.required]],
            email: [null, [Validators.required]],
            genero: ['', [Validators.required]],
            afiliado: [null, [Validators.maxLength(50)]],
            aceitar_termos: [null, [Validators.required]],
            captcha: [null, [Validators.required]],
            check_1: [''],
            check_2: ['']
        }, {validator: PasswordValidation.MatchPassword});
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

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    submit() {
        const values = this.form.value;
        values.nascimento = moment(values.nascimento, 'DDMMYYYY', true).format('YYYY-MM-DD');

        this.submitting = true;
        this.clientesService.cadastrarCliente(values)
            .subscribe(
                () => {
                    // this.auth.login({username: values.usuario, password: values.senha, etapa: 1}).subscribe(
                    //     () => {
                    //         this.messageService.success('Cadastro realizado com sucesso!');
                    //     },
                    //     error => this.messageService.error(error)
                    // );
                    this.activeModal.dismiss();
                    this.messageService.success('Cadastro realizado com sucesso! Verifique seu email para ativá-lo.');
                },
                error => {
                    this.messageService.error(error);
                    this.submitting = false;
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirModalTermosUso(modal: any) {
        if (this.termosDeUso) {
            this.modalTermosRef = this.modalService.open(modal);
        }
    }

    fecharModalTermos() {
        if (this.modalTermosRef) {
            this.modalTermosRef.dismiss();
        }
    }
}
