import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pesquisa-modal',
    templateUrl: './pesquisa-modal.component.html'
})
export class PesquisaModalComponent implements OnInit {
    pesquisarForm: UntypedFormGroup = this.fb.group({
        input: ['']
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: UntypedFormBuilder,
    ) { }

    ngOnInit() { }

    pesquisar() {
        this.activeModal.close(this.pesquisarForm.value);
    }
}
