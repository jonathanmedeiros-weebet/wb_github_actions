import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {AuthService} from '../../shared/services/auth/auth.service';

@Component({
    selector: 'app-recuperar-senha',
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent extends BaseFormComponent implements OnInit {
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private clienteService: ClienteService,
        private authService: AuthService,
        private router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            email: [null, [Validators.required]]
        });
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.submitting = true;
        const values = this.form.value;
        this.authService.forgot(values)
            .subscribe(
                () => {
                    this.router.navigate(['esportes/futebol/jogos']);
                    this.messageService.success('O código de verificação foi enviado para o e-mail informado.');
                },
                error => {
                    this.handleError(error);
                    this.submitting = false;
                }
            );
    }

}
