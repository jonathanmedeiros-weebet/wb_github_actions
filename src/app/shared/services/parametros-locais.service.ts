import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ParametrosLocaisService {
    parametrosLocais;

    constructor(
        private http: HttpClient
    ) { }

    load() {
        return new Promise((resolve, reject) => {
            const time = + new Date();
            return this.http.get(`./param/parametros.json?${time}`)
                .subscribe(response => {
                    this.parametrosLocais = response;
                    resolve(true);
                });
        });
    }

    getParametros(): Observable<any> {
        const time = + new Date();
        return this.http.get(`./param/parametros.json?${time}`)
            .pipe(
                tap(parametrosLocais => this.parametrosLocais = parametrosLocais)
            );
    }

    getCampeonatosBloqueados() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_bloqueados) : null;
    }

    getCampeonatosAoVivo() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_aovivo) : null;
    }

    getCampeonatosPrincipais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.campeonatos_principais) : null;
    }
    getCotacoesLocais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.cotacoes_local) : null;
    }

    getDataLimiteTabela() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.data_limite_tabela : null;
    }

    getJogosBloqueados() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.jogos_bloqueados) : null;
    }

    getOddsPrincipais() {
        return this.parametrosLocais ? Object.assign([], this.parametrosLocais.odds_principais) : null;
    }

    getTiposAposta() {
        let result = null;
        const isLoggedIn = localStorage.getItem('token') ? true : false;

        if (isLoggedIn && localStorage.getItem('tipos_aposta')) {
            const tiposAposta = JSON.parse(localStorage.getItem('tipos_aposta'));
            if (tiposAposta) {
                result = tiposAposta;
            }
        } else {
            if (this.parametrosLocais) {
                result = this.parametrosLocais.tipos_aposta;
            }
        }

        return result;
    }

    getOpcoes() {
        return this.parametrosLocais ? Object.assign({}, this.parametrosLocais.opcoes) : null;
    }

    getInformativoRodape() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.informativo_rodape : null;
    }

    getSeninhaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.seninha_nome : null;
    }

    getQuininhaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quininha_nome : null;
    }

    seninhaAtiva() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.seninha_ativa : null;
    }

    quininhaAtiva() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quininha_ativa : null;
    }

    getBancaNome() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.banca_nome : null;
    }

    getOddsImpressao() {
        const tiposAposta = this.getTiposAposta();
        const oddsImpressao = [];
        for (const key in tiposAposta) {
            if (tiposAposta.hasOwnProperty(key)) {
                const tipoAposta = tiposAposta[key];
                if (parseInt(tipoAposta.exibirImpressao, 10)) {
                    oddsImpressao.push(key);
                }
            }
        }
        return oddsImpressao;
    }

    getExibirCampeonatosExpandido() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.exibir_campeonatos_expandido : null;
    }

    getPrimeiraPagina() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.primeira_pagina : null;
    }

    controlarCreditoCambista() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.controlar_credito_cambista : null;
    }

    quantidadeMinEventosBilhete() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quantidade_min_jogos_bilhete : null;
    }

    quantidadeMaxEventosBilhete() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.quantidade_max_jogos_bilhete : null;
    }

    minutoEncerramentoAoVivo() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.minuto_encerramento_aovivo : null;
    }

    bloquearCotacaoMenorQue() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.bloquear_cotacao_menor_que : 1.05;
    }

    getOddsBasqueteAtivas() {
        const tiposAposta = this.getTiposAposta();
        const oddsBasquete = ['bkt_casa', 'bkt_fora', 'bkt_total_pontos_par', 'bkt_total_pontos_impar'];
        const oddsBasqueteAtivas = [];

        for (const j in tiposAposta) {
            if (tiposAposta.hasOwnProperty(j)) {
                for (const k of oddsBasquete) {
                    if (k === j) {
                        oddsBasqueteAtivas.push(k);
                    }
                }
            }
        }

        return oddsBasqueteAtivas;
    }
}

