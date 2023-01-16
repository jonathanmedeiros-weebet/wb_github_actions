import {Location} from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-submenu',
    templateUrl: './submenu.component.html',
    styleUrls: ['./submenu.component.css'],
})
export class SubmenuComponent implements OnInit, AfterViewInit {
    @Input() active = true;
    @Input() category = 'esporte';
    @ViewChild('scrollMenu') scrollMenu: ElementRef;
    menuWidth;
    scrollWidth;
    rightDisabled = false;
    leftDisabled = true;
    centered = false;
    isMobile = true;

    submenuItems = [];
    submenu = [];

    larguras = {
        '/esportes/live': 400,
        '/esportes/live/jogos': 0,
        '/esportes/futebol': 90,
        '/esportes/futsal': 81,
        '/esportes/volei': 75,
        '/esportes/basquete': 100,
        '/esportes/combate': 98,
        '/esportes/hoquei-gelo': 135,
        '/esportes/futebol-americano': 153,
        '/esportes/esports': 94,
        '/esportes/tenis': 77,
        '/casino/c/wall/todos': 85,
        '/casino/c/wall/slot': 72,
        '/casino/c/wall/raspadinha': 116,
        '/casino/c/wall/roleta': 86,
        '/casino/c/wall/mesa': 80,
        '/casino/c/live': 138
    };

    paddingMenu = 0;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.computeResizeChanges();
    }

    constructor(
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef,
        public location: Location,
        private router: Router,
        private translate: TranslateService
    ) {
        router.events.subscribe(val => {
            this.paddingMenu = this.larguras[this.router.url.split('?')[0]] ?? 0;
        });
    }

    ngOnInit() {
        this.paddingMenu = this.larguras[this.router.url.split('?')[0]] ?? 0;

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
    }

    ngAfterViewInit() {
        this.checkScrollWidth();
        this.checkScrollButtons();
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

    changeSvgHover(index) {
        this.submenuItems[index].svgHover = !this.submenuItems[index].svgHover;
    }

    atualizarSubmenu() {
        this.submenu = [
            {
                name: this.translate.instant('submenu.aoVivo'),
                link: '/esportes/live',
                icon_class: 'fa fa-circle blink_me',
                category: 'esporte',
                active: this.isMobile ? false : this.paramsService.getOpcoes().aovivo
            },
            {
                name: this.translate.instant('submenu.futebol'),
                link: '/esportes/futebol',
                icon_class: 'wbicon icon-futebol',
                category: 'esporte',
                active: true
            },
            {
                name: this.translate.instant('submenu.futsal'),
                link: '/esportes/futsal',
                icon_class: 'wbicon icon-futsal',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futsal
            },
            {
                name: this.translate.instant('submenu.volei'),
                link: '/esportes/volei',
                icon_class: 'wbicon icon-volei',
                category: 'esporte',
                active: this.paramsService.getOpcoes().volei
            },
            {
                name: this.translate.instant('submenu.basquete'),
                link: '/esportes/basquete',
                icon_class: 'wbicon icon-basquete',
                category: 'esporte',
                active: this.paramsService.getOpcoes().basquete
            },
            {
                name: this.translate.instant('submenu.combate'),
                link: '/esportes/combate',
                icon_class: 'wbicon icon-luta',
                category: 'esporte',
                active: this.paramsService.getOpcoes().combate
            },
            {
                name: this.translate.instant('submenu.hoquei'),
                link: '/esportes/hoquei-gelo',
                icon_class: 'wbicon icon-hoquei-no-gelo',
                category: 'esporte',
                active: this.paramsService.getOpcoes().hoquei_gelo
            },
            {
                name: this.translate.instant('submenu.futebolAmericano'),
                link: '/esportes/futebol-americano',
                icon_class: 'wbicon icon-futebol-americano',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futebol_americano
            },
            {
                name: this.translate.instant('submenu.esports'),
                link: '/esportes/esports',
                icon_class: 'wbicon icon-e-sports',
                category: 'esporte',
                active: this.paramsService.getOpcoes().esports
            },
            {
                name: this.translate.instant('submenu.tenis'),
                link: '/esportes/tenis',
                icon_class: 'wbicon icon-tenis',
                category: 'esporte',
                active: this.paramsService.getOpcoes().tenis
            },
            {
                name: this.translate.instant('submenu.quininha'),
                link: '/loterias/quininha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.quininhaAtiva()
            },
            {
                name: this.translate.instant('submenu.seninha'),
                link: '/loterias/seninha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.seninhaAtiva()
            },
            {
                name: this.translate.instant('submenu.todos'),
                link: '/casino/c/wall/todos',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: this.translate.instant('submenu.slot'),
                link: '/casino/c/wall/slot',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: this.translate.instant('submenu.raspadinha'),
                link: '/casino/c/wall/raspadinha',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: this.translate.instant('submenu.roleta'),
                link: '/casino/c/wall/roleta',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: this.translate.instant('submenu.mesa'),
                link: '/casino/c/wall/mesa',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Bingo',
                link: '/casino/c/wall/bingo',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: this.translate.instant('submenu.cassinoAoVivo'),
                link: '/casino/c/live',
                icon_class: 'fa-solid fa-dice',
                svgIcon: false,
                svgSrc: '',
                queryParams: '',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            }
        ];

        this.submenuItems = this.submenu.filter((item) => {
            return item.category === this.category && item.active;
        });
    }
}
