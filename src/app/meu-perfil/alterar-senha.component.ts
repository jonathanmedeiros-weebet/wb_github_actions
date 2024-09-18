import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {AuthService, ClienteService, MenuFooterService, MessageService, ParametrosLocaisService, SidebarService} from './../services';
import {BaseFormComponent} from '../shared/layout/base-form/base-form.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormValidations, PasswordValidation} from '../shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultifactorConfirmationModalComponent } from '../shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'alterar-senha.component.html',
    styleUrls: ['alterar-senha.component.css']
})
export class AlterarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public isCollapsed = false;
    private unsub$ = new Subject();
    public mostrarSenhaAtual: boolean = false;
    public mostrarSenhaNova: boolean = false;
    public mostrarSenhaConfirmacao: boolean = false;
    public isStrengthPassword: boolean | null;

    private tokenMultifator: string;
    private codigoMultifator: string;

    validPassword: boolean = false;
    requirements = {
        minimumCharacters: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        specialChar: false,
    };

    constructor(
        private messageService: MessageService,
        private auth: AuthService,
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private modalService: NgbModal,
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    get isCliente() {
        return this.auth.isCliente();
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngOnInit() {
        this.isStrengthPassword = this.paramsLocais.getOpcoes().isStrengthPassword;
        this.createForm();

        if(this.isCliente) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        } else {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.menuFooterService.setIsPagina(true);
    }

    toggleMostrarSenha(reference) {
        switch (reference) {
            case 'senhaAtual':
                this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
                break;
            case 'senhaNova':
                this.mostrarSenhaNova = !this.mostrarSenhaNova;
                break;
            case 'senhaConfirmacao':
                this.mostrarSenhaConfirmacao = !this.mostrarSenhaConfirmacao;
                break;
            default:
                break;
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: ['', Validators.required],
            senha_nova: ['', [Validators.required, Validators.minLength(8)]],
            senha_confirmacao: ['', [Validators.required, Validators.minLength(8)]]
        }, {validator: PasswordValidation.MatchPassword});
        
        if (this.isStrengthPassword) {
            this.form.controls.senha_nova.clearValidators();
            this.form.controls.senha_nova.addValidators(FormValidations.strongPasswordValidator())
            this.form.controls.senha_nova.updateValueAndValidity();
        }
    }

    onSubmit() {
        if (this.form.valid) {
            if(this.twoFactorInProfileChangeEnabled) {
                this.validacaoMultifator();
            } else {
                this.submit();
            }
        } else {
            this.checkFormValidations(this.form);
        }
    }

    submit() {
        let values = this.form.value;

        if(this.twoFactorInProfileChangeEnabled) {
            values = {
                ...values,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }
        
        if (this.isCliente) {
            this.clienteService.alterarSenha(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.success();
                    },
                    error => this.handleError(error)
                );
        } else {
            this.auth.changePassword(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.success();
                    },
                    error => this.handleError(error)
                );
        }
    }

    resetarForm() {
        this.form.reset();
    }

    success() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    private validacaoMultifator() {
        const modalref = this.modalService.open(
            MultifactorConfirmationModalComponent, {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350',
                centered: true,
                backdrop: 'static'
            }
        );
 
        modalref.componentInstance.senha = this.form.get('senha_atual').value;
        modalref.result.then(
            (result) => {
                this.tokenMultifator = result.token;
                this.codigoMultifator = result.codigo;

                if (result.checked) {
                    this.submit();
                }
            }
        );
    }

    checkPassword() {
        const passwordValue = this.form.controls.senha_nova.value;
        const lengthCheck = passwordValue.length >= 8;
        const hasUpperCase = /[A-Z]/.test(passwordValue);
        const hasLowerCase = /[a-z]/.test(passwordValue);
        const hasSpecialChar = /[!@#$%^&*]/.test(passwordValue);
        
        this.requirements = {
          minimumCharacters: lengthCheck,
          uppercaseLetter: hasUpperCase,
          lowercaseLetter: hasLowerCase,
          specialChar: hasSpecialChar,
        };

        this.validPassword = Object.values(this.requirements).every(Boolean);
    }
}
