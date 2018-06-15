import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-resultados',
    templateUrl: 'resultados.component.html',
    styleUrls: ['resultados.component.css']
})
export class ResultadosComponent implements OnInit {
    numbers = [1, 4, 30, 44];

    constructor() { }

    ngOnInit() { }
}
