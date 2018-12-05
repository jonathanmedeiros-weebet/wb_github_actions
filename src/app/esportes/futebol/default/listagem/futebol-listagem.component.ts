import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Campeonato, Jogo, ItemBilheteEsportivo } from './../../../../models';
import { CampeonatoService, MessageService, BilheteEsportivoService } from './../../../../services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import PerfectScrollbar from 'perfect-scrollbar';

declare var $;

@Component({
    selector: 'app-futebol-listagem',
    templateUrl: 'futebol-listagem.component.html',
    styleUrls: ['futebol-listagem.component.css']
})
export class FutebolListagemComponent implements OnInit, OnDestroy {
    diaEspecifico = true;
    campeonatos: Campeonato[];
    itens: ItemBilheteEsportivo[] = [];
    showLoadingIndicator = true;
    unsub$ = new Subject();

    constructor(
        private campeonatoService: CampeonatoService,
        private messageService: MessageService,
        private bilheteService: BilheteEsportivoService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                if (params['campeonato']) {
                    const campeonatoId = +params['campeonato'];
                    const queryParams: any = {
                        'odds': ['casa_90', 'empate_90', 'fora_90']
                    };

                    this.campeonatoService.getCampeonato(campeonatoId, queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonato => {
                                this.showLoadingIndicator = false;
                                this.campeonatos = [campeonato];
                            },
                            error => this.messageService.error(error)
                        );
                } else {
                    const campeonatosBloqueados = JSON.parse(localStorage.getItem('campeonatos_bloqueados'));
                    const queryParams: any = {
                        'campeonatos_bloqueados': campeonatosBloqueados,
                        'odds': ['casa_90', 'empate_90', 'fora_90']
                    };

                    if (params['data']) {
                        const data = moment(params['data']).format('YYYY-MM-DD');
                        queryParams.data = data;
                    } else {
                        queryParams.data = moment().format('YYYY-MM-DD');
                    }

                    if (params['nome']) {
                        queryParams.nome = params['nome'];
                    }

                    this.campeonatoService.getCampeonatos(queryParams)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            campeonatos => {
                                this.showLoadingIndicator = false;
                                this.campeonatos = campeonatos;
                            },
                            error => this.messageService.error(error)
                        );
                }
            });

        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => this.itens = itens);

        let altura = window.innerHeight - 69;
        $('.wrap-sticky').css('min-height', altura - 60);
        $('.content-sports-scroll').css('height', altura);
        $('.pre-bilhete').css('height', altura);

        const ps = new PerfectScrollbar('.custom-scroll');

        // window.addEventListener('resize', e => {
        //     let newAltura = window.innerHeight - 172;
        //     document.querySelector('.content-sports').style.height = newAltura + 'px';
        //     document.querySelector('.pre-bilhete').style.height = (newAltura + 40) + 'px';
        // });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
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
}
