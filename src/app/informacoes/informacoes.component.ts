import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginaService } from './../services';
import { Pagina } from './../models';

@Component({
    templateUrl: './informacoes.component.html'
})
export class InformacoesComponent implements OnInit, OnDestroy {
    showLoadingIndicator = true;
    pagina = new Pagina();
    conteudo;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private paginaService: PaginaService
    ) { }

    ngOnInit() {
        this.route.data
            .pipe(takeUntil(this.unsub$))
            .subscribe(data => {
                this.paginaService.getPaginaPorChave(data.pagina)
                    .subscribe(pagina => {
                        this.pagina = pagina;
                        this.showLoadingIndicator = false;
                    });
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }
}
