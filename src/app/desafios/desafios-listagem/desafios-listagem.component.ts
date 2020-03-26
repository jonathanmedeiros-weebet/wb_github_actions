import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';
import { DesafioCategoria } from './../../models';
import { DesafioCategoriaService, MessageService } from './../../services';

@Component({
    selector: 'app-desafios-listagem',
    templateUrl: './desafios-listagem.component.html',
    styleUrls: ['./desafios-listagem.component.css']
})
export class DesafiosListagemComponent implements OnInit {
    showLoadingIndicator;
    categorias: DesafioCategoria[];
    itensSelecionados = {};
    contentEl;

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private categoriaService: DesafioCategoriaService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.route.queryParams
            .pipe(take(1))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                if (params['categoria']) {
                } else {
                }

                this.getCategorias();
            });
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
                },
                error => this.handleError(error)
            );
    }

    handleError(error) {
        this.showLoadingIndicator = false;
        this.messageService.error(error);
    }

}
