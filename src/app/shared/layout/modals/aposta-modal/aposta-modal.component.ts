import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApostaEsportivaService, MessageService } from './../../../../services';

@Component({
    selector: 'app-aposta-modal',
    templateUrl: './aposta-modal.component.html',
    styleUrls: ['./aposta-modal.component.css']
})
export class ApostaModalComponent implements OnInit {
    exibirBilhete = false;
    aposta;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
    }

    private pesquisarAposta() {
        const input = this.pesquisarForm.value.input;

        this.apostaEsportivaService.getAposta(input)
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
