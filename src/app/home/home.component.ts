import { Component, OnInit } from '@angular/core';
import { config } from './../shared/config';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

    BANCA_NOME = config.BANCA_NOME;

    constructor() { }

    ngOnInit() { }
}
