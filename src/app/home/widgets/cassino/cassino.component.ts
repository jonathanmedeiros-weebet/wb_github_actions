import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChildren, QueryList, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services';
import { LoginModalComponent } from 'src/app/shared/layout/modals';

@Component({
    selector: 'app-cassino',
    templateUrl: './cassino.component.html',
    styleUrls: ['./cassino.component.css']
})
export class CassinoComponent implements OnInit {
    @ViewChildren('scrollGames') gamesScroll: QueryList<ElementRef>;
    @Input() games = [];
    @Input() title: string;
    @Input() linkAll: string;
    @Input() showLoadingIndicator: boolean;

    isMobile = false;
    modalRef: NgbModalRef;
    isLoggedIn = false;
    isCliente = false;

    constructor(
        private modalService: NgbModal,
        private auth: AuthService,
        private renderer: Renderer2,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.auth.logado
            .subscribe((isLoggedIn: any) => {
                this.isLoggedIn = isLoggedIn;
            }
            );

        this.auth.cliente
            .subscribe((isCliente: any) => {
                this.isCliente = isCliente;
            }
            );
    }

    scrollLeft(scrollId: string) {
        const scrollTemp = this.gamesScroll.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft -= 700;
    }

    scrollRight(scrollId: string) {
        const scrollTemp = this.gamesScroll.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        scrollTemp.nativeElement.scrollLeft += 700;
    }

    onScroll(scrollId: string) {
        this.cd.detectChanges();
        const scrollTemp = this.gamesScroll.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
        const scrollLeft = scrollTemp.nativeElement.scrollLeft;
        const scrollWidth = scrollTemp.nativeElement.scrollWidth;

        const scrollLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-left`);
        const scrollRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-right`);

        const fadeLeftTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-left`);
        const fadeRightTemp = this.el.nativeElement.querySelector(`#${scrollId}-fade-right`);

        const maxScrollSize = scrollTemp.nativeElement.clientWidth;

        if (scrollLeft <= 0) {
            if (!this.isMobile) {
                this.renderer.addClass(scrollLeftTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'enabled-scroll-button');
            }
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '0');
        } else {
            if (!this.isMobile) {
                this.renderer.addClass(scrollLeftTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollLeftTemp, 'disabled-scroll-button');
            }
            this.renderer.setStyle(fadeLeftTemp, 'opacity', '1');
        }

        if ((scrollWidth - (scrollLeft + maxScrollSize)) <= 1) {
            if (!this.isMobile) {
                this.renderer.addClass(scrollRightTemp, 'disabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'enabled-scroll-button');
            }
            this.renderer.setStyle(fadeRightTemp, 'opacity', '0');
        } else {
            if (!this.isMobile) {
                this.renderer.addClass(scrollRightTemp, 'enabled-scroll-button');
                this.renderer.removeClass(scrollRightTemp, 'disabled-scroll-button');
            }
            this.renderer.setStyle(fadeRightTemp, 'opacity', '1');
        }
    }

    abrirModalLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );

        console.log('Modal', this.modalRef);
    }
}
