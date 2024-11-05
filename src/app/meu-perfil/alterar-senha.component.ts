import { FaceMatchService } from 'src/app/shared/services/face-match.service';

import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, AfterViewChecked, AfterContentChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {AuthService, ClienteService, MenuFooterService, MessageService, ParametrosLocaisService, SidebarService} from './../services';
import {BaseFormComponent} from '../shared/layout/base-form/base-form.component';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormValidations, PasswordValidation} from '../shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultifactorConfirmationModalComponent } from '../shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { Cliente } from '../shared/models/clientes/cliente';
import { LegitimuzService } from '../shared/services/legitimuz.service';
import { TranslateService } from '@ngx-translate/core';
import { LegitimuzFacialService } from '../shared/services/legitimuz-facial.service';
import * as CryptoJS from 'crypto-js';

declare global {
    interface Window {
      ex_partner: any;
      exDocCheck: any;
    }
  }

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'alterar-senha.component.html',
    styleUrls: ['alterar-senha.component.css']
})
export class AlterarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    public isCollapsed = false;
    private unsub$ = new Subject();
    public mostrarSenhaAtual: boolean = false;
    public mostrarSenhaNova: boolean = false;
    public mostrarSenhaConfirmacao: boolean = false;
    public isStrengthPassword: boolean | null;

    private tokenMultifator: string;
    private codigoMultifator: string;
    currentLanguage = 'pt';
    cliente: Cliente;
    faceMatchEnabled = false;
    faceMatchChangePassword = false;
    faceMatchChangePasswordValidated = false;
    legitimuzToken = "";
    verifiedIdentity = null;
    disapprovedIdentity = false;
    showLoading = true;
    faceMatchType = null;

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
        private paramsLocais: ParametrosLocaisService,
        private legitimuzService: LegitimuzService,
        private LegitimuzFacialService: LegitimuzFacialService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private faceMatchService: FaceMatchService
    ) {
        super();
    }
    ngAfterContentChecked(): void {
        this.cd.detectChanges();
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

        if (this.isCliente) {
            this.sidebarService.changeItens({ contexto: 'cliente' });
        } else {
            this.sidebarService.changeItens({ contexto: 'cambista' });
        }

        this.menuFooterService.setIsPagina(true);

        this.currentLanguage = this.translate.currentLang;
        this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
        this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
        if (!this.faceMatchEnabled) {
            this.faceMatchChangePasswordValidated = true;
        }

        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.faceMatchEnabled) {
                this.legitimuzService.changeLang(change.lang);
            }
        });

        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => {
                    this.handleError(error);
                }

            );
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    if (this.verifiedIdentity) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe({
                            next: (res) => {
                                this.LegitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchChangePasswordValidated = true;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchChangePasswordValidated = false;
                            }
                        })
                    }
                });
            this.LegitimuzFacialService.faceIndex
                .pipe(takeUntil(this.unsub$))
                .subscribe(faceIndex => {
                    if (faceIndex) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe({
                            next: (res) => {
                                this.LegitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchChangePasswordValidated = true;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchChangePasswordValidated = false;
                            }
                        })
                    }
                })
        }
    }
    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuz.changes
                .subscribe(() => {
                    this.legitimuzService.init();
                    this.legitimuzService.mount();
                });
            this.legitimuzLiveness.changes
                .subscribe(() => {
                    this.LegitimuzFacialService.init();
                    this.LegitimuzFacialService.mount();
                });
        }
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
            if (this.twoFactorInProfileChangeEnabled) {
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

        if (this.twoFactorInProfileChangeEnabled) {
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
    hmacHash(cpf) {
        const concatenatedString = cpf+ this.paramsLocais.getOpcoes().dockCheck_secret_hash ;
        const hash = CryptoJS.SHA256(concatenatedString);
        return hash.toString(CryptoJS.enc.Hex);   
    }
}
