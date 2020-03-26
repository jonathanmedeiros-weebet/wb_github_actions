import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { Desafio, DesafioCategoria } from './../../models';
import { DesafioCategoriaService, MessageService, DesafioBilheteService } from './../../services';

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
        private categoriaService: DesafioCategoriaService,
        private bilheteService: DesafioBilheteService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.definirAltura();

        // Recebendo os itens atuais do bilhete
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(itens => {
                this.itens = itens;

                console.log('\n XX');
                console.log(itens);

                this.itensSelecionados = {};
                for (let i = 0; i < itens.length; i++) {
                    const item = itens[i];
                    this.itensSelecionados[item.odd.id] = true;
                }

                console.log(this.itensSelecionados);

                this.cd.markForCheck();
            });

        this.route.queryParams
            .pipe(take(1))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                this.getCategorias();
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-sticky');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura - 60}px`);
        this.contentEl = this.el.nativeElement.querySelector('.content-list');
        this.renderer.setStyle(this.contentEl, 'height', `${altura}px`);
    }

    getCategorias() {
        this.categoriaService.getCategorias()
            .subscribe(
                categorias => {
                    this.showLoadingIndicator = false;
                    this.categorias = categorias;

                    this.cd.markForCheck();
                },
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

    handleError(error) {
        this.showLoadingIndicator = false;
        this.messageService.error(error);
    }

}
