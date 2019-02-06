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
        return this.parametrosLocais ? this.parametrosLocais.campeonatos_bloqueados : null;
    }

    getCampeonatosAoVivo() {
        return this.parametrosLocais ? this.parametrosLocais.campeonatos_aovivo : null;
    }

    getCampeonatosPrincipais() {
        return this.parametrosLocais ? this.parametrosLocais.campeonatos_principais : null;
    }
    getCotacoesLocais() {
        return this.parametrosLocais ? this.parametrosLocais.cotacoes_local : null;
    }

    getDataLimiteTabela() {
        return this.parametrosLocais ? this.parametrosLocais.data_limite_tabela : null;
    }

    getJogosBloqueados() {
        return this.parametrosLocais ? this.parametrosLocais.jogos_bloqueados : null;
    }

    getOddsPrincipais() {
        return this.parametrosLocais ? this.parametrosLocais.odds_principais : null;
    }

    getTiposAposta() {
        return this.parametrosLocais ? this.parametrosLocais.tipos_aposta : null;
    }

    getOpcoes() {
        return this.parametrosLocais ? this.parametrosLocais.opcoes : null;
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
}

