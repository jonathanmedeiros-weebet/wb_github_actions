import { Component, OnInit } from '@angular/core';
import { SorteioService } from 'src/app/shared/services/rifa/sorteio.service';
import {Observable, Observer} from 'rxjs';
import {config} from '../../shared/config';
import {RifaBilheteService} from '../../shared/services/rifa/rifa-bilhete.service';

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {


    public sorteios;
    public SLUG = config.SLUG;


    constructor(
        private sorteioService: SorteioService,
        private rifaBilheteService: RifaBilheteService

    ) {}

    loadSorteios() {

        this.sorteioService.getSorteios().subscribe({
            next: (sorteios) => {
                this.sorteios = sorteios;
            }});

    }

    selecionar(soteio) {
        this.rifaBilheteService.selecionarSorteio(soteio);
    }


    ngOnInit() {
        this.loadSorteios();
    }

}
