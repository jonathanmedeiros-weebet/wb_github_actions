import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ParametrosLocaisService } from '../../services/parametros-locais.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from './../../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-submenu',
    templateUrl: './submenu.component.html',
    styleUrls: ['./submenu.component.css'],
})
export class SubmenuComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() active = true;
    @Input() category = 'esporte';
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    unsub$ = new Subject();
    menuWidth;
    scrollWidth;
    rightDisabled = false;
    leftDisabled = true;
    centered = false;
    isMobile = true;

    submenuItems = [];
    submenu = [];

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.computeResizeChanges();
    }

    constructor(
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        public location: Location,
        private router: Router,
        private translate: TranslateService,
        private el: ElementRef,
        private layoutService: LayoutService,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.layoutService.changeSubmenuHeight(40);

        if (window.innerWidth > 1024) {
            this.menuWidth = window.innerWidth - 270;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }

        this.atualizarSubmenu();

        this.translate.onLangChange.subscribe(() => {
            this.atualizarSubmenu();
            this.cd.detectChanges();
            this.checkScrollWidth();
            this.computeResizeChanges();
        });

        if (this.isMobile) {
            this.layoutService.hideSubmenu
                .pipe(takeUntil(this.unsub$))
                .subscribe(hideSubmenu => {
                    const submenuContainer = this.el.nativeElement.querySelector('#submenu-container');
                    const navSubmenu = this.el.nativeElement.querySelector('#nav-submenu');
                    if (navSubmenu) {
                        if (hideSubmenu) {
                            this.layoutService.changeSubmenuHeight(0);
                            this.renderer.setStyle(submenuContainer, 'min-height', '0');
                            this.renderer.setStyle(navSubmenu, 'height', '0');
                        } else {
                            this.renderer.setStyle(submenuContainer, 'min-height', '40px');
                            this.renderer.setStyle(navSubmenu, 'height', '38px');
                            this.layoutService.changeSubmenuHeight(40);
                        }
                    }
                    this.cd.detectChanges();
                });
        }
    }

    ngAfterViewInit() {
        this.checkScrollWidth();
        this.checkScrollButtons();
        this.scrollToActiveButton();
    }

    ngOnDestroy(): void {
        this.layoutService.changeSubmenuHeight(0);
        this.unsub$.next();
        this.unsub$.complete();
    }

    checkScrollWidth() {
        this.scrollWidth = this.scrollMenu.nativeElement.scrollWidth;
    }

    computeResizeChanges() {
        this.cd.detectChanges();
        if (window.innerWidth > 1024) {
            this.menuWidth = window.innerWidth - 270;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }
        this.checkScrollButtons();
    }

    checkScrollButtons() {
        if (this.menuWidth >= this.scrollWidth) {
            this.rightDisabled = true;
            this.leftDisabled = true;
        } else {
            this.rightDisabled = false;
        }

        this.centered = this.rightDisabled && this.leftDisabled;
        this.cd.detectChanges();
    }

    scrollLeft() {
        this.scrollMenu.nativeElement.scrollLeft -= 200;
    }

    scrollRight() {
        this.scrollMenu.nativeElement.scrollLeft += 200;
    }

    onScroll(event) {
        const scrollLeft = this.scrollMenu.nativeElement.scrollLeft;

        this.leftDisabled = scrollLeft <= 0;

        this.rightDisabled = (this.scrollWidth - (scrollLeft + this.menuWidth)) <= 0;
    }

    scrollToActiveButton() {
        if (this.isMobile) {
            const submenuAtivo = this.submenu.find(submenu => {
                return submenu.link == this.router.url.split('?')[0];
            });

            const activeButtonElement = this.el.nativeElement.querySelector(`#${submenuAtivo.id}`);
            if (activeButtonElement) {
                this.scrollMenu.nativeElement.scrollLeft = activeButtonElement.offsetLeft - 35;
            }
        }
    }

    svgByRouteCss(route, hover = false) {
        let svgCss = {
            'width.px': 18,
            'fill': 'var(--foreground-sub-nav)'
        };

        if (this.router.url === route || hover) {
            svgCss = {
                'width.px': 18,
                'fill': 'var(--foreground-highlight)'
            };
        }

        return svgCss;
    }

    svgByRouteCssStroke(route, hover = false) {
        let svgCss = {
            'width.px': 18,
            'stroke': 'var(--foreground-sub-nav)',
        };

        if (this.router.url === route || hover) {
            svgCss = {
                'width.px': 18,
                'stroke': 'var(--foreground-highlight)'
            };
        }

        return svgCss;
    }

    changeSvgHover(index) {
        this.submenuItems[index].svgHover = !this.submenuItems[index].svgHover;
    }

    atualizarSubmenu() {
        this.submenu = [
            {
                id: 'aovivo',
                name: this.translate.instant('submenu.aoVivo'),
                link: '/live',
                icon_class: 'fa fa-circle blink_me',
                category: 'esporte',
                active: this.isMobile ? false : this.paramsService.getOpcoes().aovivo
            },
            {
                id: 'futebol',
                name: this.translate.instant('submenu.futebol'),
                link: '/esportes/futebol',
                icon_class: 'wbicon icon-futebol',
                category: 'esporte',
                active: true
            },
            {
                id: 'basquete',
                name: this.translate.instant('submenu.basquete'),
                link: '/esportes/basquete',
                icon_class: 'wbicon icon-basquete',
                category: 'esporte',
                active: this.paramsService.getOpcoes().basquete
            },
            {
                id: 'combate',
                name: this.translate.instant('submenu.combate'),
                link: '/esportes/combate',
                icon_class: 'wbicon icon-luta',
                category: 'esporte',
                active: this.paramsService.getOpcoes().combate
            },
            {
                id: 'volei',
                name: this.translate.instant('submenu.volei'),
                link: '/esportes/volei',
                icon_class: 'wbicon icon-volei',
                category: 'esporte',
                active: this.paramsService.getOpcoes().volei
            },
            {
                id: 'tenis',
                name: this.translate.instant('submenu.tenis'),
                link: '/esportes/tenis',
                icon_class: 'wbicon icon-tenis',
                category: 'esporte',
                active: this.paramsService.getOpcoes().tenis
            },
            {
                id: 'futebol-americano',
                name: this.translate.instant('submenu.futebolAmericano'),
                link: '/esportes/futebol-americano',
                icon_class: 'wbicon icon-futebol-americano',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futebol_americano
            },
            {
                id: 'futsal',
                name: this.translate.instant('submenu.futsal'),
                link: '/esportes/futsal',
                icon_class: 'wbicon icon-futsal',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futsal
            },
            {
                id: 'hoquei',
                name: this.translate.instant('submenu.hoquei'),
                link: '/esportes/hoquei-gelo',
                icon_class: 'wbicon icon-hoquei-no-gelo',
                category: 'esporte',
                active: this.paramsService.getOpcoes().hoquei_gelo
            },
            {
                id: 'esports',
                name: this.translate.instant('submenu.esports'),
                link: '/esportes/esports',
                icon_class: 'wbicon icon-e-sports',
                category: 'esporte',
                active: this.paramsService.getOpcoes().esports
            },
            {
                id: 'seninha',
                name: this.paramsService.getSeninhaNome(),
                link: '/loterias/seninha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.seninhaAtiva()
            },
            {
                id: 'quininha',
                name: this.paramsService.getQuininhaNome(),
                link: '/loterias/quininha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.quininhaAtiva()
            },
            {
                id: 'loteria-popular',
                name: this.translate.instant('submenu.loteriaPopular'),
                link: '/loterias/loteria-popular',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.loteriaPopularAtiva()
            },
            {
                id: 'cassino',
                name: this.translate.instant('submenu.todos'),
                link: '/casino/c/wall/todos',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgStroke: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/todos.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: "crash",
                name: this.translate.instant('submenu.crash'),
                link: '/casino/c/wall/crash',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/crash.svg',
                active: this.paramsService.getOpcoes().casino
            },
            // {
            //     id: 'live-cassino',
            //     name: this.translate.instant('submenu.cassinoAoVivo'),
            //     link: '/casino/c/wall/live',
            //     icon_class: 'fa-solid fa-dice',
            //     svgIcon: true,
            //     svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/cassino_ao_vivo.svg',
            //     queryParams: '',
            //     category: 'cassino',
            //     active: this.paramsService.getOpcoes().casino
            // },
            {
                id: 'slot',
                name: this.translate.instant('submenu.slot'),
                link: '/casino/c/wall/slot',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/slot.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'roleta',
                name: this.translate.instant('submenu.roleta'),
                link: '/casino/c/wall/roleta',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/roleta.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'mesa',
                name: this.translate.instant('submenu.mesa'),
                link: '/casino/c/wall/mesa',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/mesa.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'raspadinha',
                name: this.translate.instant('submenu.raspadinha'),
                link: '/casino/c/wall/raspadinha',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/raspadinha.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'bingo',
                name: 'Bingo',
                link: '/casino/c/wall/bingo',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/bingo.svg',
                active: this.paramsService.getOpcoes().salsa_cassino
            },
            {
                id: 'cassino-live',
                name: this.translate.instant('submenu.todos'),
                link: '/casino/cl/wall-live/todos',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgStroke: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/todos.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'roleta',
                name: 'Roleta',
                link: '/casino/cl/wall-live/roleta',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/roleta.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'blackjack',
                name: 'Blackjack',
                link: '/casino/cl/wall-live/blackjack',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/blackjack.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'gameshow',
                name: 'Game Show',
                link: '/casino/cl/wall-live/gameshow',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/game-show.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'baccarat',
                name: 'Baccarat',
                link: '/casino/cl/wall-live/baccarat',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/baccarat.svg',
                active: this.paramsService.getOpcoes().casino
            },
            {
                id: 'poker',
                name: 'Poker',
                link: '/casino/cl/wall-live/poker',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino-live',
                svgIcon: true,
                svgSrc: 'https://weebet.s3.amazonaws.com/cdn/img/icons/poker.svg',
                active: this.paramsService.getOpcoes().casino
            },
        ];

        this.submenuItems = this.submenu.filter((item) => {
            return item.category === this.category && item.active;
        });
    }
}
