import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    ParametrosLocaisService, CampeonatoService, SidebarService,
    MessageService, LiveService, MenuFooterService
} from '../../../services';
import { LiveJogoComponent } from '../jogo/live-jogo.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-live-wrapper',
    templateUrl: 'live-wrapper.component.html',
    styleUrls: ['live-wrapper.component.css']
})
export class LiveWrapperComponent implements OnInit, OnDestroy {
    exibirMaisCotacoes = false;
    jogoId;
    mobileScreen = false;
    unsub$ = new Subject();
    modalRef;
    subEsporte: any;
    esporte = 'futebol';
    sportId = 1;

    constructor(
        private campeonatoService: CampeonatoService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private liveService: LiveService,
        private modalServices: NgbModal,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subEsporte = this.route.params.subscribe(params => {
            this.changeSport(params['esporte']);
            this.getJogos();
        });

        this.mobileScreen = window.innerWidth <= 1024 ? true : false;
        this.liveService.connect();
    }

    ngOnDestroy() {
        this.setIsPagina(false);
        this.liveService.disconnect();
        this.unsub$.next();
        this.unsub$.complete();
        this.subEsporte.unsubscribe();
    }

    changeSport(esporte) {
        if (esporte == 'futebol') {
            this.sportId = 1;
            this.esporte = esporte;
        } else {
            this.sportId = 18;
            this.esporte = esporte;
        }
    }

    getJogos() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportId);
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': this.sportId,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'data_final': opcoes.data_limite_tabela,
        };

        if (this.sportId == 1) {
            this.campeonatoService.getCampeonatosPorRegioes(params)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    campeonatos => {
                        const dados = {
                            itens: campeonatos,
                            contexto: 'esportes',
                            esporte: this.esporte
                        };

                        this.sidebarService.changeItens(dados);
                    },
                    error => this.messageService.error(error)
                );
        } else {
            this.campeonatoService.getCampeonatos(params)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    campeonatos => {
                        const dados = {
                            itens: campeonatos,
                            contexto: 'esportes',
                            esporte: this.esporte
                        };

                        this.sidebarService.changeItens(dados);
                    },
                    error => this.messageService.error(error)
                );
        }
    }

    receptorJogoSelecionadoId(jogoId) {
        this.jogoId = jogoId;
    }

    changeExibirMaisCotacoes(exibirMaisCotacoes) {

        if(this.mobileScreen) {
            this.modalRef = this.modalServices.open(LiveJogoComponent);
            this.modalRef.componentInstance.jogoId = this.jogoId;
        } else {
            this.setIsPagina(exibirMaisCotacoes);
            this.exibirMaisCotacoes = exibirMaisCotacoes;
        }
    }

    setIsPagina(isPage) {
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(isPage);
        }
    }
}
