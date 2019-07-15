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
    @ViewChild('bilheteContent') bilheteContent;
    aposta;
    stats = {};
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
                if (params['id']) {
                    const id = +params['id'];

                    this.apostaEsportivaService.getAposta(id)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            apostaEsportiva => {
                                this.aposta = apostaEsportiva;
                                console.log(apostaEsportiva);
                                this.ativarAoVivo();
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
            this.stats[item.jogo.fi] = new Estatistica();
            const horarioLimite = moment(item.jogo.horario).add('2', 'hours');

            if (item.resultado) {
                this.stats[item.jogo.fi] = item.jogo.estatisticas;
            } else if (moment().isSameOrAfter(item.jogo.horario) && moment().isBefore(horarioLimite)) {
                this.liveStats(item.jogo.fi);
            }
        });

        console.log(this.stats);
    }

    liveStats(jogoId) {
        this.liveService.getJogoStats(jogoId)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                stats => {
                    console.log(stats);
                    this.stats[jogoId] = stats;
                    // console.log(this.stats);
                }
            );
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
        };
    }
}
