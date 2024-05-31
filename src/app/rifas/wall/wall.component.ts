import { Component, OnInit } from '@angular/core';
import { RifaSorteioService } from 'src/app/shared/services/rifa/rifa-sorteio.service';
import {Observable, Observer} from 'rxjs';
import {config} from '../../shared/config';
import {RifaBilheteService} from '../../shared/services/rifa/rifa-bilhete.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-wall',
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {


    public sorteios;
    public SLUG = config.SLUG;


    constructor(
        private sorteioService: RifaSorteioService,
        private rifaBilheteService: RifaBilheteService,
        private router: Router

    ) {}

    loadSorteios() {

        this.sorteioService.getSorteios().subscribe({
            next: (sorteios) => {
                if (sorteios.length == 1) {
                    this.redirecionar(sorteios[0]);

                } else {
                    this.sorteios = sorteios;
                }
            }});

    }

    redirecionar(soteio) {
        this.router.navigate(['/rifas/show', soteio.id]);

    }

    selecionar(soteio) {
        this.rifaBilheteService.selecionarSorteio(soteio);
    }


    ngOnInit() {
        this.loadSorteios();
    }

}
