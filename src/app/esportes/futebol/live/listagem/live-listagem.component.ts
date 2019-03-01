import { Component, OnInit, OnDestroy, Renderer2, ElementRef, DoCheck } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, delay, tap } from 'rxjs/operators';
import { ParametrosLocaisService, MessageService, JogoService, LiveService } from '../../../../services';
import { Jogo } from '../../../../models';

@Component({
    selector: 'app-live-listagem',
    templateUrl: 'live-listagem.component.html',
    styleUrls: ['live-listagem.component.css']
})
export class LiveListagemComponent implements OnInit, OnDestroy, DoCheck {
    jogos = {};
    campeonatos = new Map();
    idsCampeonatosLiberados = this.paramsService.getCampeonatosAoVivo();
    temJogoAoVivo = true;
    awaiting = true;
    showLoadingIndicator = true;
    contentSportsEl;
    unsub$ = new Subject();

    constructor(
        private messageService: MessageService,
        private jogoService: JogoService,
        private liveService: LiveService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsService: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.definindoAlturas();

        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();

                        campeonato.jogos.forEach(jogo => {
                            jogos.set(jogo._id, jogo);
                        });

                        campeonato.jogos = jogos;

                        this.campeonatos.set(campeonato._id, campeonato);
                    });


                    setTimeout(() => {
                        this.awaiting = false;
                    }, 3000);

                    this.showLoadingIndicator = false;

                    this.live();
                },
                error => this.handleError(error)
            );
    }

    ngDoCheck() {
        if (!this.awaiting) {
            const jogosEl = this.el.nativeElement.querySelector('.jogos');
            this.temJogoAoVivo = jogosEl ? true : false;
        }
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definindoAlturas() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentSportsEl = this.el.nativeElement.querySelector('.content-sports');
        this.renderer.setStyle(this.contentSportsEl, 'height', `${altura}px`);
    }

    live() {
        this.liveService.getJogos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: Jogo) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);

                if (!campeonato) {
                    campeonato = {
                        _id: jogo.campeonato._id,
                        nome: jogo.campeonato.nome,
                        jogos: new Map()
                    };
                    this.campeonatos.set(jogo.campeonato._id, campeonato);
                }

                if (!jogo.finalizado && jogo.cotacoes.length > 0) {
                    campeonato.jogos.set(jogo._id, jogo);
                } else {
                    campeonato.jogos.delete(jogo._id);

                    if (!campeonato.jogos.size) {
                        this.campeonatos.delete(campeonato._id);
                    }
                }
            });
    }

    reOrder(a, b) {
        return a.value.nome.localeCompare(b.value.nome);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    campeonatoPermitido(campenatoId) {
        return this.idsCampeonatosLiberados.includes(campenatoId);
    }

    trackById(index: number, campeonato: any): string {
        return campeonato._id;
    }
}
