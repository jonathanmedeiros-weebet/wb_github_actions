import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Desafio, DesafioCategoria } from './../../models';
import { DesafioService, MessageService, DesafioBilheteService } from './../../services';

@Component({
    selector: 'app-desafios-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './desafios-listagem.component.html',
    styleUrls: ['./desafios-listagem.component.css']
})
export class DesafiosListagemComponent implements OnInit, OnDestroy {
    showLoadingIndicator;
    categorias: DesafioCategoria[];
    itens: any[] = [];
    itensSelecionados = {};
    contentEl;
    unsub$ = new Subject();

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private desafioService: DesafioService,
        private bilheteService: DesafioBilheteService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.definirAltura();
        this.subscribeItens();

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                if (params['categoria']) {
                    const queryParams = {
                        categoria: +params['categoria']
                    };

                    this.getDesafios(queryParams);
                } else {
                    this.getDesafios();
                }
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    subscribeItens() {
        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.itens = itens;

                this.itensSelecionados = {};
                for (let i = 0; i < itens.length; i++) {
                    const item = itens[i];
                    this.itensSelecionados[item.odd.id] = true;
                }

                this.cd.markForCheck();
            });
        this.bilheteService.atualizarItens(this.itens);
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentEl = this.el.nativeElement.querySelector('.content-list');
        this.renderer.setStyle(this.contentEl, 'height', `${altura}px`);
    }

    getDesafios(queryParams?) {
        this.desafioService.getDesafios(queryParams)
            .subscribe(
                desafios => this.agruparPorCategoria(desafios),
                error => this.handleError(error)
            );
    }

    addCotacao(desafio: Desafio, odd) {
        let modificado = false;
        const indexDesafio = this.itens.findIndex(i => i.desafio.id === desafio.id);
        const indexOdd = this.itens.findIndex(i => (i.desafio.id === desafio.id) && (i.odd_id === odd.id));

        const item = {
            odd_id: odd.id,
            desafio: desafio,
            odd: odd
        };

        if (indexDesafio >= 0) {
            if (indexOdd >= 0) {
                this.itens.splice(indexOdd, 1);
            } else {
                this.itens.splice(indexDesafio, 1, item);
            }

            delete this.itensSelecionados[`${odd.id}`];
            modificado = true;
        } else {
            this.itens.push(item);

            this.itensSelecionados[`${odd.id}`] = true;
            modificado = true;
        }

        if (modificado) {
            this.bilheteService.atualizarItens(this.itens);
        }
    }

    agruparPorCategoria(desafios) {
        const categorias = {};
        this.categorias = [];

        desafios.forEach(desafio => {
            if (!desafio.odd_correta) {
                let categoria = categorias[desafio.categoria.id];
                if (!categoria) {
                    categoria = {
                        desafios: [],
                        categoria: desafio.categoria
                    };

                    categorias[desafio.categoria.id] = categoria;
                }

                categoria.desafios.push(desafio);
            }
        });

        for (const id in categorias) {
            if (categorias.hasOwnProperty(id)) {
                const element = categorias[id];

                const categoria = new DesafioCategoria();
                categoria.id = element.categoria.id;
                categoria.nome = element.categoria.nome;
                categoria.desafios = element.desafios;

                this.categorias.push(categoria);
            }
        }

        this.showLoadingIndicator = false;
        this.cd.markForCheck();
    }

    handleError(error) {
        this.showLoadingIndicator = false;
        this.messageService.error(error);
    }

    trackById(index: number, categoria: any): string {
        return categoria.id;
    }
}
