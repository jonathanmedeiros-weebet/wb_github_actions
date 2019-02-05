declare var WB: any;

export class ParametrosLocais {

    static getParametrosLocais() {
        return WB;
    }

    static getCampeonatosBloqueados() {
        return WB.campeonatos_bloqueados;
    }

    static getCampeonatosAoVivo() {
        return WB.campeonatos_aovivo;
    }

    static getCampeonatosPrincipais() {
        return WB.campeonatos_principais;
    }
    static getCotacoesLocais() {
        return WB.cotacoes_local;
    }

    static getDataLimiteTabela() {
        return WB.data_limite_tabela;
    }

    static getJogosBloqueados() {
        return WB.jogos_bloqueados;
    }

    static getOddsPrincipais() {
        return WB.odds_principais;
    }

    static getTiposAposta() {
        return WB.tipos_aposta;
    }

    static getOpcoes() {
        return WB.opcoes;
    }

    static getInformativoRodape() {
        return WB.opcoes.informativo_rodape;
    }

    static getBancaNome() {
        return WB.opcoes.banca_nome;
    }

    static getOddsImpressao() {
        const tiposAposta = ParametrosLocais.getTiposAposta();
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
