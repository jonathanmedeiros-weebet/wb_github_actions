import {Component, Input, OnDestroy, OnInit, DoCheck, ElementRef, Renderer2, ChangeDetectorRef} from '@angular/core';
import {SidebarService} from '../../shared/services/utils/sidebar.service';
import {LayoutService, MenuFooterService} from '../../services';
import {Router} from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.css']
})
export class CasinoWrapperComponent implements OnInit, OnDestroy, DoCheck {
    @Input() showLoadingIndicator;
    mobileScreen = false;
    isVirtuais = false;
    isGameView = false;
    headerHeight = 92;
    unsub$ = new Subject();

    constructor(
        private sideBarService: SidebarService,
        private menuFooterService: MenuFooterService,
        private router: Router,
        private el: ElementRef,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService
    ) {}

    ngOnInit(): void {
        this.isVirtuais = this.router.url.split('/')[2] === 'v';

        this.mobileScreen = window.innerWidth <= 1024;
        this.sideBarService.changeItens({
            contexto: 'casino',
            dados: {}
        });
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    ngDoCheck(): void {
        this.isGameView = this.router.url.split('/')[3] === 'play';
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    definirAltura() {
        const headerHeight = this.mobileScreen ? 161 : this.headerHeight;
        const casinoContent = this.el.nativeElement.querySelector('.casino-content');
        this.renderer.setStyle(casinoContent, 'height', `calc(100vh - ${headerHeight}px)`);
    }

}
