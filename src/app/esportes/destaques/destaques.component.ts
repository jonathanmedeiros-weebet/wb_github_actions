import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {
    @Input() campeonatosDestaques;
    @Output() campeonatoSelecionado = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    selecionarCampeonato(camp) {
        this.campeonatoSelecionado.emit(camp);
    }

}
