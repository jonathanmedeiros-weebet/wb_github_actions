import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApostaEsportivaService, MessageService } from './../../../../services';

@Component({
    selector: 'app-pesquisar-aposta-modal',
    templateUrl: './pesquisar-aposta-modal.component.html',
    styleUrls: ['./pesquisar-aposta-modal.component.css']
})
export class PesquisarApostaModalComponent implements OnInit, OnDestroy {
    exibirBilhete = false;
    aposta;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService
    ) { }

    ngOnInit() { }

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
}
