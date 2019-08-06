import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApostaEsportivaService, LiveService } from './../services';
import { Estatistica } from './../models';
import * as moment from 'moment';

@Component({
    selector: 'app-bilhete',
    templateUrl: 'bilhete.component.html',
    styleUrls: ['bilhete.component.css']
})
export class BilheteComponent implements OnInit, OnDestroy {
    @ViewChild('bilheteContent', { static: false }) bilheteContent;
    aposta;
    stats = {};
    chaves = {};
    cambistaPaga;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private apostaEsportivaService: ApostaEsportivaService,
        private liveService: LiveService,
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.route.params
            .subscribe((params: any) => {
                if (params['chave']) {
                    this.apostaEsportivaService.getAposta(params['chave'])
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            apostaEsportiva => {
                                this.aposta = apostaEsportiva;
                                this.ativarAoVivo();
                                if (this.aposta.passador.percentualPremio > 0) {
                                    this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
                                }
                            },
                            error => console.log(error)
                        );
                }
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const content = this.el.nativeElement.querySelector('#bilhete-reativo');
        this.renderer.setStyle(content, 'height', `${window.innerHeight}px`);
    }

    ativarAoVivo() {
        this.aposta.itens.forEach(item => {
            const horarioInicio = moment(item.jogo.horario).subtract('10', 'm');
            const horarioFim = moment(item.jogo.horario).add('2', 'hours');

            this.chaves[item.jogo.fi] = item.aposta_tipo.chave;
            const estatistica = new Estatistica();
            this.stats[item.jogo.fi] = estatistica;

            if (item.resultado) {
                const jogo = item.jogo;
                estatistica.time_a_resultado = jogo.time_a_resultado;
                estatistica.time_b_resultado = jogo.time_b_resultado;
                estatistica.time_a_resultado_1t = jogo.time_a_resultado_1t;
                estatistica.time_b_resultado_1t = jogo.time_b_resultado_1t;
                estatistica.time_a_resultado_2t = jogo.time_a_resultado_2t;
                estatistica.time_b_resultado_2t = jogo.time_b_resultado_2t;
                estatistica.time_a_escanteios = jogo.time_a_escanteios;
                estatistica.time_b_escanteios = jogo.time_b_escanteios;
                estatistica.resultado = item.resultado;
            } else if (!item.removido && moment().isSameOrAfter(horarioInicio) && moment().isBefore(horarioFim)) {
                this.liveStats(item.jogo.fi);
            }

            if (item.removido) {
                estatistica.removido = true;
                estatistica.resultado = 'cancelado';
            }
        });
    }

    liveStats(jogoId) {
        this.liveService.getJogoStats(jogoId)
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

    verificarResultadoAposta() {
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
                    this.aposta.resultado = 'ganhou';
                } else {
                    if (aoMenosUmPerdeu) {
                        this.aposta.resultado = 'perdeu';
                    }
                }
            } else {
                if (aoMenosUmPerdeu) {
                    this.aposta.resultado = 'perdeu';
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
            default:
                break;
        }

        this.verificarResultadoAposta();
    }
}
