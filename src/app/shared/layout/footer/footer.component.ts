import { Component, OnInit } from '@angular/core';
import { config } from '../../config';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html'
})
export class FooterComponent implements OnInit {
    BANCA_NOME = '';

    constructor() { }

    ngOnInit() {
        this.BANCA_NOME = config.BANCA_NOME;
    }
}
