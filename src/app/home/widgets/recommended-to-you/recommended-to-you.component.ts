import { ChangeDetectorRef, Component, ElementRef, Input, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-recommended-to-you',
  templateUrl: './recommended-to-you.component.html',
  styleUrls: ['./recommended-to-you.component.scss']
})
export class RecommendedToYouComponent {
  @ViewChildren('scrollGames') gamesScroll: QueryList<ElementRef>;
  @Input() title: string;
  @Input() icon: string;
  @Input() linkAll: string;
  @Input() games: any[] = [];
  isMobile = false;
  scrollStep = 700;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 1025;

    if (this.isMobile) {
      this.scrollStep = 200;
    }
  }

  scrollLeft(scrollId: string) {
    const scrollTemp = this.gamesScroll.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
    scrollTemp.nativeElement.scrollLeft -= this.scrollStep;
  }

  scrollRight(scrollId: string) {
    const scrollTemp = this.gamesScroll.find((scroll) => scroll.nativeElement.id === scrollId + '-scroll');
    scrollTemp.nativeElement.scrollLeft += this.scrollStep;
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
}
