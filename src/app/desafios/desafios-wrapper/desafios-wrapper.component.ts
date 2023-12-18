import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SidebarService, DesafioCategoriaService, MessageService, LayoutService } from '../../services';

@Component({
    selector: 'app-desafios-wrapper',
    templateUrl: './desafios-wrapper.component.html',
    styleUrls: ['./desafios-wrapper.component.css']
})
export class DesafiosWrapperComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();
    headerHeight = 92;

    constructor(
        private desafioCategoriaService: DesafioCategoriaService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.contexto !== 'desafio') {
                        this.getDesafioCategorias2Sidebar();
                    }
                }
            );

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getDesafioCategorias2Sidebar() {
        this.desafioCategoriaService.getCategorias()
            .pipe(take(1))
            .subscribe(
                categorias => {
                    const dados = {
                        itens: categorias,
                        contexto: 'desafio'
                    };

                    this.sidebarService.changeItens(dados);
                },
                error => this.messageService.error(error)
            );
    }

    definirAltura() {
        const desafiosWrapper = this.el.nativeElement.querySelector('#desafios-wrapper');
        const desafiosContent = this.el.nativeElement.querySelector('.desafios-content');
        this.renderer.setStyle(desafiosWrapper, 'max-height', `calc(100vh - ${this.headerHeight}px)`);
        this.renderer.setStyle(desafiosContent, 'height', `calc(100vh - ${this.headerHeight}px)`);
    }

}
