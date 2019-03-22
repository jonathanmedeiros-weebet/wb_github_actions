import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pesquisa-modal',
    templateUrl: './pesquisa-modal.component.html',
    styleUrls: ['./pesquisa-modal.component.css']
})
export class PesquisaModalComponent implements OnInit {
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
    ) { }

    ngOnInit() { }

    private pesquisar() {
        this.activeModal.close(this.pesquisarForm.value);
    }
}
