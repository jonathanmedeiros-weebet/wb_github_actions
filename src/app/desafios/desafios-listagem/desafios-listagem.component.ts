import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ElementRef,
    Renderer2,
    ChangeDetectionStrategy,
    OnDestroy,
    ViewChildren,
    QueryList, AfterViewInit, HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Desafio, DesafioCategoria } from './../../models';
import {DesafioService, MessageService, DesafioBilheteService, SidebarService, LayoutService} from './../../services';

@Component({
    selector: 'app-desafios-listagem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './desafios-listagem.component.html',
    styleUrls: ['./desafios-listagem.component.css']
})
export class DesafiosListagemComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('scrollOdds') private oddsNavs: QueryList<ElementRef>;
    showLoadingIndicator;
    categorias: DesafioCategoria[];
    itens: any[] = [];
    itensSelecionados = {};
    contentEl;
    unsub$ = new Subject();
    mobileScreen = true;
    navs: ElementRef[];
    sidebarNavIsCollapsed: boolean;
    enableScrollButtons: {} = {};
    maxOddsSize: number;
    desafios;
    headerHeight = 92;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.detectScrollOddsWidth(this.desafios);
    }
    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private desafioService: DesafioService,
        private bilheteService: DesafioBilheteService,
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
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
                this.detectScrollOddsWidth(this.desafios);
            });

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.sidebarNavIsCollapsed = collapsed;
                this.detectScrollOddsWidth(this.desafios);
            });

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

    ngAfterViewInit() {
        this.oddsNavs.changes.subscribe((navs) => {
            this.navs = navs.toArray();
        });
    }

    moveLeft(event_id) {
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === event_id.toString());
        scrollTemp.nativeElement.scrollLeft -= 150;
    }

    moveRight(id) {
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === id.toString());
        scrollTemp.nativeElement.scrollLeft += 150;
    }

    onScroll(id) {
        this.cd.detectChanges();
        const scrollTemp = this.navs.find((nav) => nav.nativeElement.id === id.toString());
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#scroll-left-${id}`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#scroll-right-${id}`);

        if (scrollLeftTemp) {
            if (scrollLeft <= 0) {
                this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
            } else {
                this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            }
        }

        if (scrollRightTemp) {
            if ((scrollWidth - (scrollLeft + this.maxOddsSize - 50)) <= 0) {
                this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            } else {
                this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            }
        }
    }

    detectScrollOddsWidth(desafios) {
        this.cd.detectChanges();
        const sidesSize = this.sidebarNavIsCollapsed ? 270 : 540;
        const centerSize = window.innerWidth - sidesSize;

        if (this.mobileScreen) {
            this.maxOddsSize = window.innerWidth;
        } else {
            this.maxOddsSize = centerSize;
        }

        if (desafios) {
            desafios.forEach(desafio => {
                let oddSize = this.maxOddsSize / desafio.odds.length;
                if (oddSize < 100) {
                    oddSize = 100;
                }

                this.enableScrollButtons[desafio.id] = (oddSize * desafio.odds.length) > this.maxOddsSize;
            });
        }
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
        const headerHeight = this.mobileScreen ? 145 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
        this.contentEl = this.el.nativeElement.querySelector('.content-list');
        this.renderer.setStyle(this.contentEl, 'min-height', `${altura}px`);
    }

    getDesafios(queryParams?) {
        this.desafioService.getDesafios(queryParams)
            .subscribe(
                desafios => {
                    this.agruparPorCategoria(desafios);
                    this.desafios = desafios;
                    this.detectScrollOddsWidth(desafios);
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

    agruparPorCategoria(desafios) {
        const categorias = {};
        this.categorias = [];

        this.detectScrollOddsWidth(desafios);

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
