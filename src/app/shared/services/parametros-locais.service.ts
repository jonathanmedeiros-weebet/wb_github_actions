import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { ErrorService } from './utils/error.service';

@Injectable({
    providedIn: 'root'
})
export class ParametrosLocaisService {
    parametrosLocais;

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) { }


    getParametros(): Observable<any> {
        const time = + new Date();
        return this.http.get(`./param/parametros.json?${time}`)
            .pipe(
                tap(parametrosLocais => this.parametrosLocais = parametrosLocais)
            );
    }

    getCampeonatosBloqueados() {
        return this.parametrosLocais.campeonatos_bloqueados;
    }

    getCampeonatosAoVivo() {
        return this.parametrosLocais.campeonatos_aovivo;
    }

    getCampeonatosPrincipais() {
        return this.parametrosLocais.campeonatos_principais;
    }
    getCotacoesLocais() {
        return this.parametrosLocais.cotacoes_local;
    }

    getDataLimiteTabela() {
        return this.parametrosLocais.data_limite_tabela;
    }

    getJogosBloqueados() {
        return this.parametrosLocais.jogos_bloqueados;
    }

    getOddsPrincipais() {
        return this.parametrosLocais.odds_principais;
    }

    getTiposAposta() {
        return this.parametrosLocais.tipos_aposta;
    }

    getOpcoes() {
        return this.parametrosLocais.opcoes;
    }

    getInformativoRodape() {
        return this.parametrosLocais.opcoes.informativo_rodape;
    }

    getBancaNome() {
        return this.parametrosLocais.opcoes.banca_nome;
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
}

