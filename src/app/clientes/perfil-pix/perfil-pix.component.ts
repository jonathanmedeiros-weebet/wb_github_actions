import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ClienteService, MenuFooterService, MessageService, SidebarService, AuthService, ParametrosLocaisService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MultifactorConfirmationModalComponent } from 'src/app/shared/layout/modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil-pix',
  templateUrl: './perfil-pix.component.html',
  styleUrls: ['./perfil-pix.component.css']
})
export class PerfilPixComponent extends BaseFormComponent implements OnInit {

    public showLoading: boolean = true;
    public mostrarSenha: boolean = false;
    public googleLogin: boolean = false;
    public availablePaymentMethods = '';

    private tokenMultifator: string;
    private codigoMultifator: string;

    constructor(
        private fb: UntypedFormBuilder,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private router: Router,
        private modalService: NgbModal,
        private translate: TranslateService
    ) {
        super();
    }

    get isMobile(): boolean {
        return window.innerWidth <= 1025;
    }

    get twoFactorInProfileChangeEnabled(): boolean {
        return Boolean(this.paramsLocais.getOpcoes()?.enable_two_factor_in_profile_change);
    }

    ngOnInit(): void {
        const user = this.auth.getUser();
        this.googleLogin = user?.google_login ?? false;

        this.sidebarService.changeItens({contexto: 'cliente'});
        this.availablePaymentMethods = this.paramsLocais.getOpcoes()?.available_payment_methods;

        this.createForm();
        this.loadCliente();

        this.menuFooterService.setIsPagina(true);

        if (!this.paramsLocais.getOpcoes().permitir_qualquer_chave_pix) {
            this.router.navigate(['clientes/perfil']);
        }
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    private loadCliente() {
        const user = JSON.parse(localStorage.getItem('user'));

        this.clienteService
            .getCliente(user.id)
            .subscribe(
                cliente => {
                    this.form.patchValue({chave_pix: cliente.chave_pix});
                    this.showLoading = false;
                },
                error => {
                    this.handleError(this.translate.instant('erroInesperado'));
                }
            );
    }

    public createForm() {
        this.form = this.fb.group({
            chave_pix: [''],
            senha_atual: [null, this.googleLogin ? [] : Validators.required]
        });
    }

    public resetarForm() {
        this.showLoading = true;
        this.loadCliente();
    }

    public onSubmit() {
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

    public submit() {
        let values = this.form.value;

        if(this.twoFactorInProfileChangeEnabled) {
            values = {
                ...values,
                token: this.tokenMultifator,
                codigo: this.codigoMultifator
            }
        }

        const chavePix = this.form.value['chave_pix'];
        if(chavePix.match(/@/)){
            this.form.value['chave_pix'] = chavePix.toLowerCase().trim();
        }

        this.clienteService
            .atualizarPix(values)
            .subscribe(
                () => this.messageService.success(this.translate.instant('geral.alteracoesSucesso')),
                error => this.handleError(error)
            );
    }

    private validacaoMultifator() {
        const options: NgbModalOptions = this.isMobile
            ? {
                windowClass: 'modal-fullscreen',
                backdrop: 'static'
            }
            : {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350',
                centered: true,
                backdrop: 'static'
            };

        const modalRef = this.modalService.open(MultifactorConfirmationModalComponent, options);
        modalRef.componentInstance.senha = this.form.get('senha_atual').value;

        modalRef.result.then((result) => {
            this.tokenMultifator = result.token;
            this.codigoMultifator = result.codigo;

            if (result.checked) {
                this.submit();
            }
        });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
