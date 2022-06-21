import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
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

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.cd.detectChanges();
        if (window.innerWidth > 1024) {
            this.menuWidth = window.innerWidth - 480;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;

        }
        this.checkScrollButtons();
    }

    constructor(
        private paramsService: ParametrosLocaisService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.submenu = [
            {
                name: 'Ao-Vivo',
                link: '/esportes/live',
                icon_class: 'wbicon icon-ao-vivo',
                category: 'esporte',
                active: this.paramsService.getOpcoes().aovivo
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
                name: 'Seninha',
                link: '/loterias/seninha',
                icon_class: 'wbicon icon-basquete',
                category: 'loteria',
                active: this.paramsService.seninhaAtiva()
            },
            {
                name: 'Quininha',
                link: '/loterias/quininha',
                icon_class: 'wbicon icon-basquete',
                category: 'loteria',
                active: this.paramsService.quininhaAtiva()
            }
        ];

        this.submenuItems = this.submenu.filter((item) => {
            return item.category === this.category && item.active;
        });

        if (window.innerWidth > 1024) {
            this.menuWidth = window.innerWidth - 480;
            this.isMobile = false;
        } else {
            this.menuWidth = window.innerWidth;
            this.isMobile = true;
        }
    }

    ngAfterViewInit() {
        this.scrollWidth = this.scrollMenu.nativeElement.scrollWidth;

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
        let scrollLeft = this.scrollMenu.nativeElement.scrollLeft;

        this.leftDisabled = scrollLeft <= 0;

        this.rightDisabled = (this.scrollWidth - (scrollLeft + this.menuWidth)) <= 0;
    }
}
