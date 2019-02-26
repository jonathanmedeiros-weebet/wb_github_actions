import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, CampeonatoService, SidebarService, MessageService } from './../../../../services';

@Component({
    selector: 'app-combate-default-wrapper',
    templateUrl: 'combate-default-wrapper.component.html',
    styleUrls: ['combate-default-wrapper.component.css']
})
export class CombateDefaultWrapperComponent implements OnInit, OnDestroy {
    eventoId;
    exibirMaisCotacoes = false;
    mobileScreen = true;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        // this.mobileScreen = window.innerWidth <= 668 ? true : false;
        this.getEventos();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getEventos() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 9,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => this.sidebarService.changeItens(campeonatos, 'combate'),
                error => this.messageService.error(error)
            );
    }

    receptorEventoSelecionadoId(eventoId) {
        this.eventoId = eventoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {
        this.exibirMaisCotacoes = exibirMaisCotacoes;
    }
}
