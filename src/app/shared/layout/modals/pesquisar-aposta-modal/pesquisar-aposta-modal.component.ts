import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExibirBilheteEsportivoComponent } from './../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { AuthService, ApostaEsportivaService, HelperService, MessageService } from './../../../../services';

@Component({
    selector: 'app-pesquisar-aposta-modal',
    templateUrl: './pesquisar-aposta-modal.component.html',
    styleUrls: ['./pesquisar-aposta-modal.component.css']
})
export class PesquisarApostaModalComponent implements OnInit, OnDestroy {
    @ViewChild(ExibirBilheteEsportivoComponent) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    exibirBilhete = false;
    aposta;
    appMobile;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private helperService: HelperService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    pesquisarAposta() {
        const input = this.pesquisarForm.value.input;

        this.apostaEsportivaService.getAposta(input)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                apostaEsportiva => {
                    this.pesquisarForm.reset();
                    this.aposta = apostaEsportiva;
                    this.exibirBilhete = true;
                },
                error => this.messageService.error(error)
            );
    }

    printTicket() {
        this.bilheteEsportivoComponent.print();
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.shared();
        } else {
            this.helperService.sharedLotteryTicket(this.aposta);
        }
    }
}
