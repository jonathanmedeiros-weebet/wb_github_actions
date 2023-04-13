import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-carregamento-modal',
    templateUrl: './carregamento-modal.component.html',
    styleUrls: ['./carregamento-modal.component.css'],
})
export class CarregamentoModalComponent implements OnInit {
    @Input() msg = 'Carregando...';

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit() {
     
    }

}
