import {
    Component, OnInit, OnDestroy, Renderer2,
    ElementRef, DoCheck, Output, EventEmitter
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametrosLocaisService, MessageService, JogoService, LiveService } from '../../../../services';
import { Jogo } from '../../../../models';

@Component({
    selector: 'app-live-listagem',
    templateUrl: 'live-listagem.component.html',
    styleUrls: ['live-listagem.component.css']
})
export class LiveListagemComponent implements OnInit, OnDestroy, DoCheck {
    @Output() jogoSelecionadoId = new EventEmitter();
    @Output() exibirMaisCotacoes = new EventEmitter();
    jogos = {};
    campeonatos = new Map();
    idsCampeonatosLiberados = this.paramsService.getCampeonatosAoVivo();
    temJogoAoVivo = true;
    awaiting = true;
    showLoadingIndicator = true;
    contentSportsEl;
    minutoEncerramentoAoVivo = 0;
    jogosBloqueados;
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
        this.liveService.entrarSalaEventos();
        this.definindoAlturas();

        this.minutoEncerramentoAoVivo = this.paramsService.minutoEncerramentoAoVivo();
        this.jogosBloqueados = this.paramsService.getJogosBloqueados();

        this.jogoService.getJogosAoVivo()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatos => {
                    campeonatos.forEach(campeonato => {
                        const jogos = new Map();
                        let temJogoValido = false;

                        campeonato.jogos.forEach(jogo => {
                            let valido = true;

                            if (this.minutoEncerramentoAoVivo > 0) {
                                if (jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                                    valido = false;
                                }
                            }

                            if (this.jogoBloqueado(jogo._id)) {
                                valido = false;
                            }

                            if (valido) {
                                jogos.set(jogo._id, jogo);
                                temJogoValido = true;
                            }
                        });

                        campeonato.jogos = jogos;

                        if (temJogoValido) {
                            this.campeonatos.set(campeonato._id, campeonato);
                        }
                    });


                    setTimeout(() => {
                        this.awaiting = false;
                    }, 2000);

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
        this.liveService.sairSalaEventos();
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
        this.liveService.getEventos()
            .pipe(takeUntil(this.unsub$))
            .subscribe((jogo: any) => {
                let campeonato = this.campeonatos.get(jogo.campeonato._id);
                let inserirCampeonato = false;

                if (!campeonato) {
                    campeonato = {
                        _id: jogo.campeonato._id,
                        nome: jogo.campeonato.nome,
                        regiao_sigla: jogo.campeonato.regiao_sigla,
                        jogos: new Map()
                    };

                    inserirCampeonato = true;
                }

                let valido = true;
                if (this.minutoEncerramentoAoVivo > 0) {
                    if (jogo.info.minutos > this.minutoEncerramentoAoVivo) {
                        valido = false;
                    }
                }

                if (this.jogoBloqueado(jogo._id)) {
                    valido = false;
                }

                if (valido && !jogo.finalizado && jogo.total_cotacoes > 0) {
                    campeonato.jogos.set(jogo._id, jogo);

                    if (inserirCampeonato) {
                        this.campeonatos.set(jogo.campeonato._id, campeonato);
                    }
                } else {
                    const eventoEncontrado = campeonato.jogos.get(jogo._id);

                    if (eventoEncontrado) {
                        campeonato.jogos.delete(jogo._id);

                        if (!campeonato.jogos.size) {
                            this.campeonatos.delete(campeonato._id);
                        }
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

    // Exibindo todas as cotações daquele jogo selecionado
    maisCotacoes(jogoId) {
        this.jogoSelecionadoId.emit(jogoId);
        this.exibirMaisCotacoes.emit(true);
    }

    jogoBloqueado(id) {
        return this.jogosBloqueados ? (this.jogosBloqueados.includes(id) ? true : false) : false;
    }
}
