import { Component, OnInit } from '@angular/core';
import {
    SidebarService,
    CampeonatoService,
    ParametrosLocaisService,
    PrintService
} from 'src/app/services';

import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
        private printService: PrintService,
        public activeModal: NgbActiveModal
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

        this.dataCampeonatos = moment().format('DD [de] MMMM [de] YYYY');

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                campeonatos.map(campeonato => {
                    campeonato.isSelected = false;
                    return campeonato;
                });

                this.campeonatosImpressao = campeonatos;
            },
            err => {
                console.log(err);
            }
        );
    }

    selecionarTodos(event: any) {
        const isChecked = event.target.checked;

        this.campeonatosImpressao.forEach(campeonato => {
            campeonato.isSelected = isChecked;
        });
    }

    getCampeonatosSelecionados() {
        return this.campeonatosImpressao.filter(campeonato => {
            return campeonato.isSelected;
        });
    }

    imprimirTabela() {
        const jogos = [{ data_grupo: moment().format('DD [de] MMMM [de] YYYY'), camps: this.getCampeonatosSelecionados() }];
        this.printService.games(jogos);
    }
}
