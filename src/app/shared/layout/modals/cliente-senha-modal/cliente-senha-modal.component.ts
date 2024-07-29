import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService, ClienteService, MessageService, ParametrosLocaisService} from 'src/app/services';
import {BaseFormComponent} from '../../base-form/base-form.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PasswordValidation} from 'src/app/shared/utils';
import { MultifactorConfirmationModalComponent } from '../multifactor-confirmation-modal/multifactor-confirmation-modal.component';

@Component({
    selector: 'app-cliente-senha-modal',
    templateUrl: './cliente-senha-modal.component.html',
    styleUrls: ['./cliente-senha-modal.component.css']
})
export class ClienteSenhaModalComponent extends BaseFormComponent implements OnInit {
    public isCollapsed: boolean = false;
    private unsub$ = new Subject();

    public mostrarSenhaAtual = false;
    public mostrarSenhaNova = false;
    public mostrarSenhaConfirmacao = false;

    private tokenMultifator: string;
    private codigoMultifator: string;

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private auth: AuthService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    get isCliente() {
        return this.auth.isCliente();
    }

    get isMobile() {
        return window.innerWidth <=1024;
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngOnInit() {
        this.createForm();
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
            this.clienteService.alterarSenha(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.handleSuccess();
                    },
                    error => this.handleError(error)
                );
        } else {
            this.auth.changePassword(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    res => {
                        this.form.reset();
                        this.handleSuccess();
                    },
                    error => this.handleError(error)
                );
        }
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

    resetarForm() {
        this.form.reset();
    }

    handleSuccess() {
        this.messageService.success('Alterações realizadas com sucesso!');
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    toClose() {
        this.activeModal.dismiss('Cross click');
    }
}
