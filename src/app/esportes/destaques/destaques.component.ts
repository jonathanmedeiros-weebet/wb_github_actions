import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {Subject} from 'rxjs';
import {CampeonatoService} from '../../shared/services/aposta-esportiva/campeonato.service';

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit, AfterViewInit {
    @Input() campeonatosDestaques = null;
    campeonatoSelecionado = false;
    unsub$ = new Subject();
    menuWidth;
    @ViewChild('scrollDestaques') scrollDestaques: ElementRef;
    rightDisabled = false;
    leftDisabled = true;
    scrollPosition = 0;
    scrollWidth;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (250 + 280);
        } else {
            this.menuWidth = window.innerWidth;
        }

        this.cd.detectChanges();

        this.checkScrollButtons();
    }

    constructor(
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private campeonatoService: CampeonatoService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'campeonatos': this.paramsService.getCampeonatosPrincipais(),
            'data_final': opcoes.data_limite_tabela,
        };

        console.log(this.paramsService.getCampeonatosPrincipais());

        if (params['campeonatos'].length) {
            this.campeonatoService.getCampeonatos(params)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    campeonatosDestaque => {
                        console.log(campeonatosDestaque);
                        this.campeonatosDestaques = campeonatosDestaque;
                        this.cd.detectChanges();
                        this.checkScrollButtons();
                    }
                );
        }

        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (250 + 280);
        } else {
            this.menuWidth = window.innerWidth;
        }
    }

    ngAfterViewInit() {
        //
    }

    checkScrollButtons() {
        this.scrollWidth = this.scrollDestaques.nativeElement.scrollWidth;
        if (this.menuWidth >= this.scrollWidth) {
            this.rightDisabled = true;
            this.leftDisabled = true;
        } else {
            this.rightDisabled = false;
        }
        this.cd.detectChanges();
    }

    scrollLeft() {
        this.scrollDestaques.nativeElement.scrollLeft -= 200;
        this.scrollPosition -= 200;
        this.checkScroll();
    }

    scrollRight() {
        this.scrollDestaques.nativeElement.scrollLeft += 200;
        this.scrollPosition += 200;
        this.checkScroll();
    }

    onScroll(e) {
        this.checkScroll();
    }

    checkScroll() {
        this.scrollPosition == 0 ? this.leftDisabled = true : this.leftDisabled = false;

        let newScrollLeft = this.scrollDestaques.nativeElement.scrollLeft;
        let width = this.scrollDestaques.nativeElement.clientWidth;
        let scrollWidth = this.scrollDestaques.nativeElement.scrollWidth;

        scrollWidth - (this.scrollPosition + width) <= 0 ? this.rightDisabled = true : this.rightDisabled = false;
    }

    menuCategoriesClasses() {
        return {
            'justify-center': this.leftDisabled && this.rightDisabled && this.menuWidth <= window.innerWidth,
            'justify-normal': window.innerWidth <= 1025 && this.menuWidth > window.innerWidth
        };
    }

    goTo(url, queryParams) {
        this.campeonatoSelecionado = true;
        this.router.navigate([url], {queryParams});
    }

    back() {
        this.campeonatoSelecionado = false;
        this.router.navigate(['/esportes/futebol/jogos']);
    }
}
