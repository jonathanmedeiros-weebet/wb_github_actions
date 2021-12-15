import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    selecionarCampeonato(camp) {
        console.log('');
    }

}
