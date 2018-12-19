import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-basquete-footer',
    templateUrl: 'basquete-footer.component.html',
    styleUrls: ['basquete-footer.component.css']
})

export class BasqueteFooterComponent implements OnInit {
    informativoRodape;

    constructor() { }

    ngOnInit() {
        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        this.informativoRodape = opcoes.informativo_rodape;
    }
}
