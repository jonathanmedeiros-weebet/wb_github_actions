import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    ParametrosLocaisService, CampeonatoService, SidebarService,
    MessageService, LiveService, MenuFooterService
} from '../../../services';

@Component({
    selector: 'app-live-wrapper',
    templateUrl: 'live-wrapper.component.html',
    styleUrls: ['live-wrapper.component.css']
})
export class LiveWrapperComponent implements OnInit, OnDestroy {
    exibirMaisCotacoes = false;
    jogoId;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private liveService: LiveService,
    ) { }

    ngOnInit() {
        this.liveService.connect();

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.esporte !== 'futebol') {
                        this.getJogos();
                    }
                }
            );
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
        this.liveService.disconnect();
        this.unsub$.next();
        this.unsub$.complete();
    }

    getJogos() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(1);
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatosPorRegioes(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    const dados = {
                        itens: campeonatos,
                        contexto: 'esportes',
                        esporte: 'futebol'
                    };

                    this.sidebarService.changeItens(dados);
                },
                error => this.messageService.error(error)
            );
    }

    receptorJogoSelecionadoId(jogoId) {
        this.jogoId = jogoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {
        this.menuFooterService.setIsPagina(exibirMaisCotacoes);
        this.exibirMaisCotacoes = exibirMaisCotacoes;
    }
}
