import { Component, OnInit } from '@angular/core';
import {
    SidebarService,
    CampeonatoService,
    ParametrosLocaisService,
    PrintService,
    HelperService,
    SportIdService
} from 'src/app/services';

import moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {
    campeonatosImpressao = [];
    campeonatosOriginal = [];
    dataCampeonatos;
    term = '';
    mobileScreen = false;
    cotacoesLocais;
    oddsPrincipais;
    qtdOddsPrincipais = 3;

    constructor(
        private sidebarService: SidebarService,
        private paramsService: ParametrosLocaisService,
        private campeonatoService: CampeonatoService,
        private printService: PrintService,
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private sportIdService: SportIdService,
    ) { }

    ngOnInit(): void {
        if (window.innerWidth >= 1025) {
            this.sidebarService.changeItens({contexto: 'cambista'});
        } else {
            this.mobileScreen = true;
        }

        const odds = this.paramsService.getOddsImpressao();
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados(this.sportIdService.footballId);
        this.cotacoesLocais = this.paramsService.getCotacoesLocais();
        this.oddsPrincipais = this.paramsService.getOddsPrincipais();
        this.qtdOddsPrincipais = this.oddsPrincipais.length;

        const queryParams: any = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'odds': odds.slice(0, 24),
            'data': moment().format('YYYY-MM-DD')
        };

        this.dataCampeonatos = moment().format('DD [de] MMMM [de] YYYY');

        this.campeonatoService.getCampeonatos(queryParams).subscribe(
            campeonatos => {
                campeonatos.forEach(campeonato => {
                    campeonato.isSelected = false;
                });

                this.campeonatosOriginal = [...campeonatos];
                this.filtrarCampeonatos();
            },
            err => {
                // console.log(err);
            }
        );
    }

    removerAcentos(texto: string): string {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    filtrarCampeonatos() {
        if (!this.term) {
            this.campeonatosImpressao = [...this.campeonatosOriginal];
        } else {
            const termoSemAcento = this.removerAcentos(this.term.toLowerCase());
            this.campeonatosImpressao = this.campeonatosOriginal.filter(campeonato => {
                const nomeSemAcento = this.removerAcentos(campeonato.nome.toLowerCase());
                return nomeSemAcento.includes(termoSemAcento);
            });
        }
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

        let campeonato = this.getCampeonatosSelecionados();
        let slice = campeonato.slice();

        slice = slice.map(campeonato => {
            return this.calcularCotacoes(campeonato);
        });
        this.printService.games(jogos);
    }

    getCotacaoLocal(jogo) {
        const cotacoesLocais = this.cotacoesLocais[jogo.event_id];

        if (cotacoesLocais) {
            return cotacoesLocais;
        } else {
            return false;
        }
    }

    calcularCotacoes(campeonato) {
        campeonato.jogos.forEach(jogo => {
            const cotacoesLocalJogo = this.getCotacaoLocal(jogo);
            jogo.cotacoes.forEach(cotacao => {
                const cotacaoLocal = cotacoesLocalJogo[cotacao.chave];
                cotacao.valorFinal = this.helperService.calcularCotacao2String(
                    cotacaoLocal ? cotacaoLocal.valor : cotacao.valor,
                    cotacao.chave,
                    jogo.event_id,
                    jogo.favorito,
                    false);
                cotacao.label = this.helperService.apostaTipoLabel(cotacao.chave, 'sigla');
            });

            this.oddsPrincipais.forEach(oddPrincipal => {
                const possuiCotacao = jogo.cotacoes.find(c => c.chave === oddPrincipal);
                if (!possuiCotacao) {
                    const cotacaoLocal = cotacoesLocalJogo[oddPrincipal];
                    jogo.cotacoes.push({
                        _id: undefined,
                        chave: oddPrincipal,
                        jogo: undefined,
                        jogoId: jogo._id,
                        label: this.helperService.apostaTipoLabel(oddPrincipal, 'sigla'),
                        nome: this.helperService.apostaTipoLabel(oddPrincipal),
                        valor: cotacaoLocal ? cotacaoLocal.valor : 0,
                        valorFinal: this.helperService.calcularCotacao2String(
                            cotacaoLocal ? cotacaoLocal.valor : 0,
                            oddPrincipal,
                            jogo.event_id,
                            jogo.favorito,
                            false)
                    });
                }
            });
        });
        return campeonato;
    }
}
