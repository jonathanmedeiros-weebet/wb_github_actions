import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {AuthService} from '../../shared/services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-recuperar-senha',
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent extends BaseFormComponent implements OnInit {

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
    }

    submit() {
        const values = this.form.value;
        this.authService.forgot(values)
            .subscribe(
                () => {
                    this.router.navigate(['esportes/futebol/jogos']);
                    this.messageService.success('Um e-mail com as instruções de recuperação foi enviado para e-mail informado!');
                },
                error => this.messageService.error(error)
            );
    }

}
