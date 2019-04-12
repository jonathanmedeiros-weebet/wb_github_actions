import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { config } from './../../../config';
import { SorteioService, ParametrosLocaisService } from '../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-exibir-bilhete-loteria',
    templateUrl: 'exibir-bilhete-loteria.component.html',
    styleUrls: ['exibir-bilhete-loteria.component.css']
})

export class ExibirBilheteLoteriaComponent implements OnInit, OnDestroy {
    @Input() aposta: any;
    LOGO;
    informativoRodape;
    sorteios = [];
    unsub$ = new Subject();

    constructor(
        private paramsService: ParametrosLocaisService,
        private sorteioService: SorteioService
    ) { }

    ngOnInit() {
        this.LOGO = config.LOGO;

        const opcoes = this.paramsService.getOpcoes();
        this.informativoRodape = opcoes.informativoRodape;

        this.sorteioService.getSorteios()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios
            );
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }
}
