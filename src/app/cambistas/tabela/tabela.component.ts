import { Component, OnInit } from '@angular/core';
import {
    SidebarService,
    CampeonatoService,
    ParametrosLocaisService,
    PrintService
} from 'src/app/services';

import * as moment from 'moment';
@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {

    campeonatosImpressao;
    dataCampeonatos;

    term = "";

    constructor(
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private campeonatoService: CampeonatoService,
        private printService: PrintService
    ) { }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});

        const odds = this.paramsService.getOddsImpressao();
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();

        const queryParams: any = {
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': odds.slice(0, 24),
            'data': moment().format('YYYY-MM-DD')
        };

        this.dataCampeonatos = moment().format('DD [de] MMMM [de] YYYY')

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                const date = moment().format('YYYYMMDD');
                const dataTree = [];

                console.log(campeonatos);

                this.campeonatosImpressao = campeonatos;
            },
            err => {
                console.log(err);
            }
        );
    }

    imprimirTabela() {
        const campsSelecionados = this.campeonatosImpressao;
        const jogos = [{ data_grupo: moment().format('DD [de] MMMM [de] YYYY'), camps: campsSelecionados }];

        this.printService.games(jogos);
    }
}
