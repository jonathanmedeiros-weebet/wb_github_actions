import {Location} from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';

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
        '/esportes/futebol-copa/copa': 108,
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
        private router: Router
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

        this.submenu = [
            {
                name: 'Copa 2022',
                link: '/esportes/futebol-copa/copa',
                icon_class: 'wbicon icon-ao-vivo',
                svgIcon: true,
                svgSrc: 'https://cdn.wee.bet/img/world-cup.svg',
                svgHover: false,
                routeActive: '/esportes/futebol-copa/copa?campeonato=01003ae97464082295b1ee23564be8bb',
                queryParams: {campeonato: '01003ae97464082295b1ee23564be8bb'},
                category: 'esporte',
                active: true
            },
            {
                name: 'Ao-Vivo',
                link: '/esportes/live',
                icon_class: 'wbicon icon-ao-vivo',
                category: 'esporte',
                active: !this.isMobile ?? this.paramsService.getOpcoes().aovivo
            },
            {
                name: 'Futebol',
                link: '/esportes/futebol',
                icon_class: 'wbicon icon-futebol',
                category: 'esporte',
                active: true
            },
            {
                name: 'Futsal',
                link: '/esportes/futsal',
                icon_class: 'wbicon icon-futsal',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futsal
            },
            {
                name: 'Vôlei',
                link: '/esportes/volei',
                icon_class: 'wbicon icon-volei',
                category: 'esporte',
                active: this.paramsService.getOpcoes().volei
            },
            {
                name: 'Basquete',
                link: '/esportes/basquete',
                icon_class: 'wbicon icon-basquete',
                category: 'esporte',
                active: this.paramsService.getOpcoes().basquete
            },
            {
                name: 'Combate',
                link: '/esportes/combate',
                icon_class: 'wbicon icon-luta',
                category: 'esporte',
                active: this.paramsService.getOpcoes().combate
            },
            {
                name: 'Hóquei no Gelo',
                link: '/esportes/hoquei-gelo',
                icon_class: 'wbicon icon-hoquei-no-gelo',
                category: 'esporte',
                active: this.paramsService.getOpcoes().hoquei_gelo
            },
            {
                name: 'Futebol Americano',
                link: '/esportes/futebol-americano',
                icon_class: 'wbicon icon-futebol-americano',
                category: 'esporte',
                active: this.paramsService.getOpcoes().futebol_americano
            },
            {
                name: 'E-Sports',
                link: '/esportes/esports',
                icon_class: 'wbicon icon-e-sports',
                category: 'esporte',
                active: this.paramsService.getOpcoes().esports
            },
            {
                name: 'Tênis',
                link: '/esportes/tenis',
                icon_class: 'wbicon icon-tenis',
                category: 'esporte',
                active: this.paramsService.getOpcoes().tenis
            },
            {
                name: 'Quininha',
                link: '/loterias/quininha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.quininhaAtiva()
            },
            {
                name: 'Seninha',
                link: '/loterias/seninha',
                icon_class: 'fa-solid fa-clover',
                category: 'loteria',
                active: this.paramsService.seninhaAtiva()
            },
            {
                name: 'Todos',
                link: '/casino/c/wall/todos',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Slot',
                link: '/casino/c/wall/slot',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Raspadinha',
                link: '/casino/c/wall/raspadinha',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Roleta',
                link: '/casino/c/wall/roleta',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Mesa',
                link: '/casino/c/wall/mesa',
                icon_class: 'fa-solid fa-dice',
                category: 'cassino',
                active: this.paramsService.getOpcoes().casino
            },
            {
                name: 'Cassino Ao Vivo',
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

    ngAfterViewInit() {
        this.scrollWidth = this.scrollMenu.nativeElement.scrollWidth;

        this.checkScrollButtons();
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
}
