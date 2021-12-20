import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {UtilsService} from "../../shared/services/utils/utils.service";

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit, AfterViewInit {
    @Output() regiaoSelecionada = new EventEmitter();
    regioesDestaque = null;

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
            this.menuWidth = window.innerWidth - 10;
        }
        this.cd.detectChanges();
        this.checkScrollButtons();
    }

    constructor(
        private router: Router,
        private utilsService: UtilsService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.utilsService.getRegioesDestaque()
            .subscribe(
                res => {
                    this.regioesDestaque = res;
                }
            );

        if (window.innerWidth > 1025) {
            this.menuWidth = window.innerWidth - (250 + 280);
        } else {
            this.menuWidth = window.innerWidth - 10;
        }
    }

    ngAfterViewInit() {
        this.checkScrollButtons();
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
            'justify-center': this.leftDisabled && this.rightDisabled && this.menuWidth <= (window.innerWidth - 10),
            'justify-normal': window.innerWidth <= 1025 && this.menuWidth > (window.innerWidth - 10)
        };
    }

    selecionarRegiao(siglaRegiao) {
        this.regiaoSelecionada.emit(siglaRegiao);
    }

    back() {
        console.log('back');
    }
}
