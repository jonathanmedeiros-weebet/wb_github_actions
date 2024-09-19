import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {AuthService, ClienteService, MenuFooterService, MessageService, ParametrosLocaisService, SidebarService} from './../services';
import {BaseFormComponent} from '../shared/layout/base-form/base-form.component';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PasswordValidation} from '../shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MultifactorConfirmationModalComponent } from '../shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { Cliente } from '../shared/models/clientes/cliente';
import { LegitimuzService } from '../shared/services/legitimuz.service';
import { TranslateService } from '@ngx-translate/core';
import { LegitimuzFacialService } from '../shared/services/legitimuz-facial.service';

@Component({
    selector: 'app-meu-perfil',
    templateUrl: 'alterar-senha.component.html',
    styleUrls: ['alterar-senha.component.css']
})
export class AlterarSenhaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    public isCollapsed = false;
    private unsub$ = new Subject();
    public mostrarSenhaAtual: boolean = false;
    public mostrarSenhaNova: boolean = false;
    public mostrarSenhaConfirmacao: boolean = false;

    private tokenMultifator: string;
    private codigoMultifator: string;
    currentLanguage = 'pt';
    cliente: Cliente;
    reconhecimentoFacialEnabled = false;
    legitimuzToken = "";
    unsubLegitimuz$ = new Subject();
    verifiedIdentity = false;
    disapprovedIdentity = false;
    token = '';
    showLoading = true;


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
        this.createForm();

        if(this.isCliente) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        } else {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.menuFooterService.setIsPagina(true);

        this.currentLanguage = this.translate.currentLang;
        this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
        this.reconhecimentoFacialEnabled = Boolean(this.paramsLocais.getOpcoes().get_Habilitar_Reconhecimento_Facial && this.legitimuzToken);

        if (this.reconhecimentoFacialEnabled) {
            this.token = `alteracao_senha ${this.auth.getToken()}`;
        }

        this.translate.onLangChange.subscribe(change => {
            this.currentLanguage = change.lang;
            if (this.reconhecimentoFacialEnabled) {
                this.legitimuzService.changeLang(change.lang);
            }
        });   
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    this.cd.detectChanges()
                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                    this.showLoading = false;
                },
                error => {
                    this.handleError(error);
                }
            
            );  
            if (this.reconhecimentoFacialEnabled && !this.disapprovedIdentity) {
                this.legitimuzService.curCustomerIsVerified
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(curCustomerIsVerified => {
                        console.log(curCustomerIsVerified)
                        this.verifiedIdentity = curCustomerIsVerified;
                        this.cd.detectChanges();
                        if (this.verifiedIdentity) {
                            this.legitimuzService.closeModal();
                            this.messageService.success('Identidade verificada!');
                        }
                    });
            }   
    }

    ngAfterViewInit() {
        if (this.reconhecimentoFacialEnabled && !this.disapprovedIdentity) {
            this.legitimuz.changes
                .pipe(takeUntil(this.unsubLegitimuz$))
                .subscribe(() => {
                    if (this.verifiedIdentity) {
                        this.legitimuzService.init();
                        this.legitimuzService.mount();                   
                    } else {
                        this.LegitimuzFacialService.init();
                        this.LegitimuzFacialService.mount();    
                    }
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
        this.unsubLegitimuz$.next();
        this.unsubLegitimuz$.complete();
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            senha_atual: ['', Validators.required],
            senha_nova: ['', [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: ['', [Validators.required, Validators.minLength(3)]]
        }, {validator: PasswordValidation.MatchPassword});
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
            if (this.verifiedIdentity) {
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
                console.log('error')
            }
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
    }
