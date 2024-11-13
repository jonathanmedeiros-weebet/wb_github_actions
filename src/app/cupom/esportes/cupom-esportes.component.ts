import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StatsService } from './../../services';
import { Estatistica } from './../../models';
import { config } from './../../shared/config';
import * as moment from 'moment';
import { ApostaEsportiva, ItemApostaEsportiva } from '../../models';

@Component({
    selector: 'app-cupom-esportes',
    templateUrl: 'cupom-esportes.component.html',
    styleUrls: ['cupom-esportes.component.css']
})
export class CupomEsportesComponent implements OnInit, OnDestroy {
    @Input() aposta;
    @Input() resultados;
    stats = {};
    chaves = {};
    cambistaPaga;
    clientesBilheteAoVivo = ['amigosdabola.wee.bet'];
    LOGO = config.LOGO_IMPRESSAO;
    unsub$ = new Subject();

    constructor(
        private statsService: StatsService
    ) { }

    ngOnInit() {
        this.ativarAoVivo();

        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }
    }

    ngOnDestroy() {
        this.statsService.disconnect();
        this.unsub$.next();
        this.unsub$.complete();
    }

    ativarAoVivo() {
        const eventosId = [];
        const itensOrdenados = this.ordenarApostaItensPorData(this.aposta);
        this.aposta.itens = itensOrdenados;

        this.aposta.itens.forEach(item => {
            const horarioInicio = moment(item.jogo_horario).subtract('10', 'm');
            const horarioFim = moment(item.jogo_horario).add('2', 'hours');

            this.chaves[item.jogo_fi] = item.aposta_tipo.chave;
            const estatistica = new Estatistica();
            this.stats[this.getIndex(item)] = estatistica;

            if (item.resultado) {
                const resultado = this.resultados.get(item.jogo_api_id);

                if (resultado) {
                    estatistica.time_a_resultado = resultado.casa;
                    estatistica.time_b_resultado = resultado.fora;
                    estatistica.time_a_resultado_1t = resultado.casa_1t;
                    estatistica.time_b_resultado_1t = resultado.fora_1t;
                    estatistica.time_a_resultado_2t = resultado.casa_2t;
                    estatistica.time_b_resultado_2t = resultado.fora_2t;
                    estatistica.time_a_escanteios = resultado.casa_escanteios;
                    estatistica.time_b_escanteios = resultado.fora_escanteios;
                } else {
                    estatistica.time_a_resultado = item.time_a_resultado;
                    estatistica.time_b_resultado = item.time_b_resultado;
                }

                estatistica.resultado = item.resultado;
            } else if (!item.removido && moment().isSameOrAfter(horarioInicio) && moment().isBefore(horarioFim) && item.jogo_fi) {
                eventosId.push(item.jogo_fi);
            }

            if (item.removido) {
                estatistica.removido = true;
                estatistica.resultado = 'cancelado';
            }
        });

        if (this.clientesBilheteAoVivo.includes(location.host)) {
            if (eventosId.length > 0) {
                this.statsService.connect();

                eventosId.forEach(id => {
                    this.statsService.entrarSalaStats(id);
                    this.liveStats(id);
                });
            }
        }
    }

    liveStats(jogoId) {
        this.statsService.getEventoStats(jogoId)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                stats => {
                    this.stats[jogoId] = stats;
                    this.vericarResultadoItem(jogoId);
                }
            );
    }

    resultadoClass(resultado) {
        return {
            'ganhou': resultado === 'ganhou' || resultado === 'ganhando',
            'perdeu': resultado === 'perdeu' || resultado === 'perdendo'
        };
    }

    getIndex(apostaItem) {
        let index = apostaItem.jogo_api_id;
        if (apostaItem.jogo_fi) {
            index = apostaItem.jogo_fi;
        }
        return index;
    }

    verificarResultadoAposta() {
        if (this.clientesBilheteAoVivo.includes(location.host)) {
            if (!this.aposta.resultado) {
                let aoMenosUmPerdeu = false;
                let todosComResultados = true;
                let acertouTodos = true;
                let qtdResults = 0;

                for (const id in this.stats) {
                    if (this.stats.hasOwnProperty(id)) {
                        const estatistica = this.stats[id];

                        if (estatistica.removido) {
                            continue;
                        }
                        if (!estatistica.resultado) {
                            todosComResultados = false;
                        }
                        if (estatistica.resultado === 'ganhou' || estatistica.resultado === 'ganhando') {
                            qtdResults++;
                        }
                        if (estatistica.resultado === 'perdeu' || estatistica.resultado === 'perdendo') {
                            aoMenosUmPerdeu = true;
                        }
                    }
                }

                if (qtdResults < Object.keys(this.stats).length) {
                    acertouTodos = false;
                }

                if (todosComResultados) {
                    if (acertouTodos) {
                        this.aposta.resultado = 'ganhando';
                        this.aposta.premio = this.aposta.possibilidade_ganho;
                    } else {
                        if (aoMenosUmPerdeu) {
                            this.aposta.resultado = 'perdendo';
                            this.aposta.premio = 0;
                        }
                    }
                } else {
                    if (aoMenosUmPerdeu) {
                        this.aposta.resultado = 'perdendo';
                        this.aposta.premio = 0;
                    }
                }
            }
        }
    }

    vericarResultadoItem(jogoId) {
        const stats: Estatistica = this.stats[jogoId];
        const chave = this.chaves[jogoId];

        let vitoria = 'ganhou';
        let derrota = 'perdeu';
        if (stats.minutos) {
            vitoria = 'ganhando';
            derrota = 'perdendo';
        }

        switch (chave) {
            case 'casa_90':
                if (stats.time_a_resultado > stats.time_b_resultado) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'empate_90':
                if (stats.time_a_resultado === stats.time_b_resultado) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'fora_90':
                if (stats.time_a_resultado < stats.time_b_resultado) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'casa_empate_90':
                if ((stats.time_a_resultado > stats.time_b_resultado) || (stats.time_a_resultado === stats.time_b_resultado)) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'fora_empate_90':
                if ((stats.time_a_resultado < stats.time_b_resultado) || (stats.time_a_resultado === stats.time_b_resultado)) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'casa_fora_90':
                if (stats.time_a_resultado != stats.time_b_resultado) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'ambos_marcam_sim_90':
                if ((stats.time_a_resultado > 0) && (stats.time_b_resultado > 0)) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'ambos_marcam_nao_90':
                if ((stats.time_a_resultado === 0) && (stats.time_b_resultado === 0)) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+0.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 0.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-0.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 0.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+1.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 1.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-1.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 1.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+2.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 2.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-2.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 2.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+3.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 3.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-3.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 3.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+4.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 4.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-4.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 4.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+5.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 5.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-5.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 5.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+6.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 6.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-6.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 6.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_+7.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) > 7.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            case 'gols_-7.5_90':
                if ((stats.time_a_resultado + stats.time_b_resultado) < 7.5) {
                    stats.resultado = vitoria;
                } else {
                    stats.resultado = derrota;
                }
                break;
            default:
                break;
        }

        this.verificarResultadoAposta();
    }
    private ordenarApostaItensPorData(aposta: ApostaEsportiva): Array<ItemApostaEsportiva> {
        let itensOrdenados;
        itensOrdenados = aposta.itens.sort((a,b) => moment(a.jogo_horario).toDate().getTime() - moment(b.jogo_horario).toDate().getTime());
        return itensOrdenados;
    }
}
