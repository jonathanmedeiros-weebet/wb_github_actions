import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { PasswordValidation } from '../../shared/utils';
import { config } from '../../shared/config';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MessageService } from '../../shared/services/utils/message.service';
import { LayoutService } from '../../shared/services/utils/layout.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-resetar-senha',
    templateUrl: './resetar-senha.component.html',
    styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent extends BaseFormComponent implements OnInit {
    recoveryToken;
    LOGO = config.LOGO;
    submitting = false;

    mostrarSenha = false;
    mostrarSenhaConfirmar = false;
    indiqueGanheRemovido = false;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: UntypedFormBuilder,
        private messageService: MessageService,
        private authService: AuthService,
        private layout: LayoutService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.route.params.subscribe((params) => {
            if (params.token) {
                this.recoveryToken = params.token;
                if (params.codigo) {
                    this.form.get('verificacao').patchValue(params.codigo);
                }
            } else {
                this.router.navigate(['esportes/futebol/jogos']);
            }
        });

        this.layout.verificaRemocaoIndiqueGanhe.pipe(takeUntil(this.unsub$)).subscribe(
            statusIndiqueGanhe => {
                this.indiqueGanheRemovido = statusIndiqueGanhe;
        });
    }

    createForm() {
        this.form = this.fb.group({
            verificacao: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
            nova_senha: [null, [Validators.required, Validators.minLength(3)]],
            senha_confirmacao: [null, [Validators.required, Validators.minLength(3)]]
        }, {validator: PasswordValidation.MatchPassword});
    }

    submit() {
        const values = this.form.value;
        values.token = this.recoveryToken;
        this.submitting = true;

        this.authService.resetPassword(values)
            .subscribe(
                () => {
                    this.router.navigate(['esportes/futebol/jogos']);
                    this.messageService.success('Senha alterada com sucesso!');
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }
}
