import {
    Component,
    OnInit,
    ChangeDetectorRef,
    ElementRef,
    Renderer2,
    ChangeDetectionStrategy,
    OnDestroy,
    ViewChildren,
    QueryList, AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SuperoddService } from 'src/app/shared/services/superodd.service';
import { MessageService, SidebarService, LayoutService } from './../../services';

@Component({
    selector: 'app-superodds-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './superodds-list.component.html',
    styleUrls: ['./superodds-list.component.css']
})
export class SuperoddsListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren('scrollOdds') private oddsNavs: QueryList<ElementRef>;
    showLoadingIndicator;
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
    superodds = [];

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private superoddService: SuperoddService,
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private layoutService: LayoutService,
        private translateService: TranslateService,
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        this.subscribeItens();

        this.route.queryParams
            .pipe(takeUntil(this.unsub$))
            .subscribe((params: any) => {
                this.showLoadingIndicator = true;

                this.getSuperodds();
            });

        this.sidebarService.collapsedSource
            .subscribe(collapsed => {
                this.sidebarNavIsCollapsed = collapsed;
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

    subscribeItens() {
        this.superoddService.itensAtuais
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
        this.superoddService.atualizarItens(this.itens);
    }

    definirAltura() {
        const headerHeight = this.mobileScreen ? 145 : this.headerHeight;
        const altura = window.innerHeight - headerHeight;
        this.contentEl = this.el.nativeElement.querySelector('.content-list');
        this.renderer.setStyle(this.contentEl, 'min-height', `${altura}px`);
    }

    getSuperodds() {
        this.superoddService.getSuperodds()
        .subscribe(
                superodds => {
                    this.superodds = superodds;
                    this.showLoadingIndicator = false;
                    this.cd.markForCheck();
                }
            )
    }

    addCotacao(superodd, odd) {
        let modificado = false;
        const indexSuperodd = this.itens.findIndex(i => i.superodd.id === superodd.id);
        const indexOdd = this.itens.findIndex(i => (i.superodd.id === superodd.id) && (i.odd_id === odd.id));

        const item = {
            odd_id: odd.id,
            superodd: superodd,
            odd: odd
        };

        if (indexSuperodd >= 0) {
            if (indexOdd >= 0) {
                this.itens.splice(indexOdd, 1);
            } else {
                this.itens.splice(indexSuperodd, 1, item);
            }

            delete this.itensSelecionados[`${odd.id}`];
            modificado = true;
        } else {
            if (this.itens.length < 1) {
                this.itens.push(item);

                this.itensSelecionados[`${odd.id}`] = true;
                modificado = true;
            } else {
                this.messageService.error(this.translateService.instant("bet.onlyOneEvent"))
            }
        }

        if (modificado) {
            this.superoddService.atualizarItens(this.itens);
        }
    }

    handleError(error) {
        this.showLoadingIndicator = false;
        this.messageService.error(error);
    }

    trackById(index: number, categoria: any): string {
        return categoria.id;
    }
}
