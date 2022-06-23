import {Component, OnInit, OnDestroy, Renderer2, ElementRef, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MenuFooterService, PaginaService} from './../services';
import {Pagina} from './../models';

@Component({
    templateUrl: './informacoes.component.html',
    styleUrls: ['informacoes.component.css']
})
export class InformacoesComponent implements OnInit, OnDestroy {
    showLoadingIndicator = true;
    pagina = new Pagina();
    conteudo;
    unsub$ = new Subject();
    mobileScreen;

    constructor(
        private route: ActivatedRoute,
        private paginaService: PaginaService,
        private menuFooterService: MenuFooterService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;

        this.route.data
            .pipe(takeUntil(this.unsub$))
            .subscribe(data => {
                this.paginaService.getPaginaPorChave(data.pagina)
                    .subscribe(pagina => {
                        this.pagina = pagina;
                        this.showLoadingIndicator = false;
                    });
            });
        this.menuFooterService.setIsPagina(true);
        this.definirAltura();
    }

    definirAltura() {
        const altura = window.innerHeight - 105;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-stick');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura}px`);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }
}
