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

    getExibirCampeonatosHojeExpandido() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes.exibir_campeonatos_hoje_expandido : null;
    }
}

