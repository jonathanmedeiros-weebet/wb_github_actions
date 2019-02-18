import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { ParametrosLocaisService, CampeonatoService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-combate-listagem',
    templateUrl: 'combate-listagem.component.html',
    styleUrls: ['combate-listagem.component.css']
})
export class CombateListagemComponent implements OnInit, OnDestroy {
    campeonatos: Campeonato[];
    campeonatosPrincipais = [];
    itens: ItemBilheteEsportivo[] = [];
    showLoadingIndicator = true;
    eventosBloqueados;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private bilheteService: BilheteEsportivoService,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;
                this.contentSportsEl.scrollTop = 0;
                this.eventosBloqueados = this.paramsService.getJogosBloqueados();

                const queryParams: any = {
                    'sport_id': 9,
                    'odds': ['cmbt_casa', 'cmbt_fora'],
                    data_final: '2030-01-01'
                };

                this.campeonatoService.getCampeonatos(queryParams)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        campeonatos => {
                            sessionStorage.setItem('camp_url', this.router.url);
                            this.campeonatosPrincipais = campeonatos.map(campeonato => campeonato._id);
                            this.campeonatos = campeonatos;
                            this.showLoadingIndicator = false;
                        },
                        error => this.messageService.error(error)
                    );
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports-scroll');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    oddSelecionada(jogoId, chave) {
        let result = false;
        this.itens.forEach(item => {
            if (item.jogo_id === jogoId && item.cotacao.chave === chave) {
                result = true;
            }
        });
        return result;
    }

    addCotacao(jogo: Jogo, cotacao) {
        let modificado = false;
        const indexGame = this.itens.findIndex(i => i.jogo._id === jogo._id);
        const indexOdd = this.itens.findIndex(i => (i.jogo._id === jogo._id) && (i.cotacao.chave === cotacao.chave));
        const item = {
            aoVivo: jogo.ao_vivo,
            jogo_id: jogo._id,
            jogo_nome: jogo.nome,
            cotacao: cotacao,
            jogo: jogo
        };

        if (indexGame >= 0) {
            if (indexOdd >= 0) {
                this.itens.splice(indexOdd, 1);
            } else {
                this.itens.splice(indexGame, 1, item);
            }
            modificado = true;
        } else {
            this.itens.push(item);
            modificado = true;
        }

        if (modificado) {
            this.bilheteService.atualizarItens(this.itens);
        }
    }

    eventoBloqueado(id) {
        return this.eventosBloqueados ? (this.eventosBloqueados.includes(id) ? true : false) : false;
    }

    setPrincipal(campeonatoId) {
        const index = this.campeonatosPrincipais.findIndex(id => id === campeonatoId);
        if (index >= 0) {
            this.campeonatosPrincipais.splice(index, 1);
        } else {
            this.campeonatosPrincipais.push(campeonatoId);
        }
    }

    campeonatoPrincipal(campeonatoId) {
        return this.campeonatosPrincipais.includes(campeonatoId);
    }
}
