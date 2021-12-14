import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-campeonato-destaque',
    templateUrl: './campeonato-destaque.component.html',
    styleUrls: ['./campeonato-destaque.component.css']
})
export class CampeonatoDestaqueComponent implements OnInit {
    @Input() campeonato;
    @Output() exibirCampeonatoDestaque = new EventEmitter();
    showLoadingIndicator = false;

    constructor() {
    }

    ngOnInit() {
    }

}
