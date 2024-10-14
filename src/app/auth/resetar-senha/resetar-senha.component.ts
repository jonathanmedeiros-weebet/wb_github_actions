import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { PasswordValidation } from '../../shared/utils';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MessageService } from '../../shared/services/utils/message.service';
import { LayoutService } from '../../shared/services/utils/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ClienteService, ParametrosLocaisService } from 'src/app/services';
import { TranslateService } from '@ngx-translate/core';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { LegitimuzFacialService } from 'src/app/shared/services/legitimuz-facial.service';

enum RecoveryStep {
    ONE_STEP = 1,
    TWO_STEP = 2
}

@Component({
    selector: 'app-resetar-senha',
    templateUrl: './resetar-senha.component.html',
    styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    private recoveryTokenStep1: string;
    private recoveryTokenStep2: string;
    public step: number = RecoveryStep.ONE_STEP;
    public submitting: boolean = false;
    public mostrarSenha: boolean = false;
    public mostrarSenhaConfirmar: boolean = false;
    public indiqueGanheRemovido: boolean = false;
    private unsub$: Subject<any> = new Subject();
    verifiedIdentity = false;
    faceMatchEnabled = true;
    faceMatchChangePasswordValidated = false;
    legitimuzToken = "";
    dataUserCPF: string;
    currentLanguage = 'pt';
    disapprovedIdentity = false;
    token = '';
    showLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        private layout: LayoutService,
        private paramLocais: ParametrosLocaisService,
        private clienteService : ClienteService,
        private cd: ChangeDetectorRef,
        private translate: TranslateService,
        private legitimuzService: LegitimuzService,
        private LegitimuzFacialService: LegitimuzFacialService,
        private faceMatchService: FaceMatchService
    ) {
        super();
    }
    ngOnDestroy(): void {
        this.unsub$.next();
        this.unsub$.complete();
    }

    get enableTwoFactorPasswordRecovery(): boolean {
        return Boolean(this.paramLocais.getOpcoes()?.enable_two_factor_password_recovery);
    }

    get twoFactorSendType(): boolean {
        return Boolean(this.paramLocais.getOpcoes()?.two_factor_send_type);
    }

    get stepIsOne(): boolean {
        return this.step === RecoveryStep.ONE_STEP;
    }

    get stepIsTwo(): boolean {
        return this.step === RecoveryStep.TWO_STEP;
    }

    ngOnInit() {
        this.currentLanguage = this.translate.currentLang;
        this.createForm();
        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.faceMatchEnabled) {
                this.legitimuzService.changeLang(change.lang);
            }
        });   
        this.route
        .params
        .subscribe((params) => {
            if (Boolean(params.token)) {
                this.recoveryTokenStep1 = params.token;
                if (Boolean(params.codigo)) {
                    this.form.get('verificacao').patchValue(params.codigo);
                    this.authService.getUserResetPassword({verificacao:params.codigo, token:params.token}).subscribe({ 
                        next: (res) => {
                            this.clienteService.getFaceMatchClient(res.results.id).subscribe({
                                next: (res) => {
                                if (res.verifiedIdentity == null) {
                                    this.dataUserCPF = res.cpf;
                                    this.token = res.cpf;
                                    this.showLoading = false;
                                    this.disapprovedIdentity = false
                                } else if (res.verifiedIdentity) {
                                    this.dataUserCPF = res.cpf;
                                    this.verifiedIdentity = true
                                    this.showLoading = false;
                                } else {
                                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                                }
                                this.cd.detectChanges();
                            }, error: (error) =>{
                                this.messageService.error(error)
                            }
                        })
                    },error: (error)=> {
                        this.messageService.error(error)
                    }
                    });
                }
            } else {
                this.router.navigate(['esportes/futebol/jogos']);
            }
        });

        this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;
        this.faceMatchEnabled = Boolean(this.paramLocais.getOpcoes().faceMatch && this.legitimuzToken) && Boolean(this.paramLocais.getOpcoes().faceMatchResetPassword);
        if (!this.faceMatchEnabled) {
            this.faceMatchChangePasswordValidated = true;
        }
        this.layout
            .verificaRemocaoIndiqueGanhe
            .pipe(takeUntil(this.unsub$))
            .subscribe(statusIndiqueGanhe => {
                this.indiqueGanheRemovido = statusIndiqueGanhe;
            });
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.legitimuzService.closeModal();
                        this.messageService.success('Identidade verificada!');
                        this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, last_reset_password: true }).subscribe()
                        this.faceMatchChangePasswordValidated = true;
                    } else {
                        this.legitimuzService.closeModal();
                        this.messageService.error('Identidade não verificada, entre em contato como o suporte');
                        this.faceMatchChangePasswordValidated = false;
                    }
                });
            this.LegitimuzFacialService.faceIndex
                .pipe(takeUntil(this.unsub$))
                .subscribe(faceIndex => {
                    if (faceIndex) {
                        this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, last_reset_password: true }).subscribe({
                            next: (res) => {
                                this.LegitimuzFacialService.closeModal();
                                this.messageService.success('Identidade verificada!');
                                this.faceMatchChangePasswordValidated = true;
                            }, error: (error) => {
                                this.messageService.error('Identidade não verificada, entre em contato como o suporte');
                                this.faceMatchChangePasswordValidated = false;
                            }
                        })
                    }
                })
        }         
    }

    createForm() {
        this.form = this.fb.group({
            verificacao: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
            verificacao2: [null],
            nova_senha: [null, [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(3)]]
        }, {validator: PasswordValidation.MatchPassword});
    }

    nextStep() {
        this.checkFormValidations(this.form);
        if (this.form.invalid) return;

        if (
            (!this.enableTwoFactorPasswordRecovery && this.stepIsOne) ||
            (this.enableTwoFactorPasswordRecovery && this.stepIsTwo)
        ) {
            this.onSubmit();
            return;
        }
        
        this.form.get('verificacao2').setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
        this.form.get('verificacao2').markAsUntouched();
        this.step = RecoveryStep.TWO_STEP;
        this.requestSMSCode();
    }

    requestSMSCode() {
        this.submitting = true;
        this.authService.requestSMSToken(RecoveryStep.TWO_STEP, this.recoveryTokenStep1).toPromise()
            .then(({ token }) => {
                this.recoveryTokenStep2 = token;
                this.submitting = false;
            })
            .catch((error) => {
                this.handleError(error);
                this.submitting = false;
            });
    }

    toBack() {
        this.step = RecoveryStep.ONE_STEP;
        this.form.get('verificacao2').setValidators([]);
        this.form.get('verificacao2').updateValueAndValidity();
    }

    submit() {
        this.submitting = true;
        const values = {
            ...this.form.value,
            token: this.recoveryTokenStep1,
            token2: this.recoveryTokenStep2
        };

        this.authService.resetPassword(values).toPromise()
            .then(() => {
                this.router.navigate(['esportes/futebol/jogos']);
                this.messageService.success('Senha alterada com sucesso!');
                this.submitting = false;
            })
            .catch((error) => {
                this.handleError(error);
                this.submitting = false;
            });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuz.changes
                .pipe()
                .subscribe(() => {
                        this.legitimuzService.init();
                        this.legitimuzService.mount();                  
                });
            this.legitimuzLiveness.changes
                .pipe()
                .subscribe(() => {
                        this.LegitimuzFacialService.init();
                        this.LegitimuzFacialService.mount();                  
                });
        }
    }
}
