import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-cartao-cadastro-modal',
    templateUrl: './cartao-cadastro-modal.component.html',
    styleUrls: ['./cartao-cadastro-modal.component.css']
})
export class CartaoCadastroModalComponent implements OnInit {
    form: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            apostador: [null, Validators.required],
            valor: [null, Validators.required],
            pin: [null, Validators.required],
            confirmacaoPin: [null, Validators.required],
        });
    }

    onSubmit() {
        console.log(this.form.value);
    }

}
