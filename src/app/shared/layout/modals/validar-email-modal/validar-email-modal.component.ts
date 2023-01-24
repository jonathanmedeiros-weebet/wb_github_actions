import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {MessageService} from '../../../services/utils/message.service';

@Component({
    selector: 'app-validar-email-modal',
    templateUrl: './validar-email-modal.component.html',
    styleUrls: ['./validar-email-modal.component.css']
})
export class ValidarEmailModalComponent implements OnInit {
    mobileScreen;
    submitting = false;
    usuario;
    botaoReenviarAtivo = true;
    cronometro = 60;

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1025;
        if (!sessionStorage.getItem('user')) {
            this.router.navigate(['esportes/futebol']);
        } else {
            this.usuario = sessionStorage.getItem('user');
        }
    }

    reenviarLinkAtivacao() {
        this.cronometro = 60;
        this.submitting = true;
        this.authService.enviarLinkAtivacao({id: this.usuario})
            .subscribe(
                () => {
                    this.messageService.success('E-mail Enviado.');
                    this.submitting = false;
                },
                error => this.handleError(error)
            );
        this.contagem();
    }

    handleError(error: string) {
        localStorage.removeItem('user');
        this.router.navigate(['esportes/futebol']);
        this.messageService.error(error);
        this.activeModal.dismiss();
    }

    contagem() {
        this.botaoReenviarAtivo = false;
        const time = setInterval(() => {
            this.cronometro = this.cronometro - 1;
            if (this.cronometro === 0) {
                clearInterval(time);
                this.botaoReenviarAtivo = true;
            }
        }, 1000);
    }
}
