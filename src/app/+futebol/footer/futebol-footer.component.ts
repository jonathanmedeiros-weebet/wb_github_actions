import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-futebol-footer',
    templateUrl: 'futebol-footer.component.html',
    styleUrls: ['futebol-footer.component.css']
})

export class FutebolFooterComponent implements OnInit {
    informativoRodape;

    constructor() { }

    ngOnInit() {
        const opcoes = JSON.parse(localStorage.getItem('opcoes'));
        this.informativoRodape = opcoes.informativo_rodape;
    }
}
