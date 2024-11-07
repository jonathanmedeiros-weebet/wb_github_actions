import { Component, OnInit } from '@angular/core';

import { ParametrosLocaisService, HelperService, CampeonatoService, PrintService, SportIdService } from './../../../../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

declare var $;

@Component({
    selector: 'app-tabela-modal',
    templateUrl: './tabela-modal.component.html'
})
export class TabelaModalComponent implements OnInit {
    campeonatosSelecionados;
    campeonatosImpressao;

    constructor(
        public activeModal: NgbActiveModal,
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private campeonatoService: CampeonatoService,
        private printService: PrintService,
        private sportIdService: SportIdService,
    ) { }

    ngOnInit() {
        const odds = this.paramsService.getOddsImpressao();
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId);

        const queryParams: any = {
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': odds.slice(0, 24),
            'data': moment().format('YYYY-MM-DD')
        };

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                const date = moment().format('YYYYMMDD');
                const dataTree = [];

                dataTree.push({
                    id: date,
                    parent: '#',
                    text: moment().format('DD [de] MMMM [de] YYYY'),
                    icon: false
                });

                this.campeonatosImpressao = campeonatos.map(campeonato => {
                    dataTree.push({
                        id: campeonato._id,
                        parent: date,
                        text: campeonato.nome,
                        icon: false
                    });

                    campeonato.jogos.forEach(jogo => {
                        jogo.cotacoes.forEach(cotacao => {
                            cotacao.valor = this.helperService.calcularCotacao(
                                cotacao.valor,
                                cotacao.chave,
                                jogo.event_id,
                                jogo.favorito
                            );
                        });
                    });

                    return campeonato;
                });

                $('#treeJogos').jstree({
                    core: {
                        data: dataTree
                    },
                    checkbox: {
                        keep_selected_style: false
                    },
                    plugins: ['checkbox']
                }).on('loaded.jstree', (e, data) => {

                }).on('changed.jstree', (e, data) => {
                    this.campeonatosSelecionados = data.selected;
                });
            },
            err => {
                console.log(err);
            }
        );
    }

    imprimirTabela() {
        const campsSelecionados = [];

        this.campeonatosImpressao.forEach(campeonatoImpressao => {
            const id = `${campeonatoImpressao._id}`;
            if (this.campeonatosSelecionados.includes(id)) {
                campsSelecionados.push(campeonatoImpressao);
            }
        });

        const jogos = [{ data_grupo: moment().format('DD [de] MMMM [de] YYYY'), camps: campsSelecionados }];

        this.printService.games(jogos);
        this.activeModal.close();
    }

}
