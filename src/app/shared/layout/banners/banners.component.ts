import {Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {BannerService, MessageService} from '../../../services';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css'],
    providers: [NgbCarouselConfig]
})
export class BannersComponent implements OnInit {
    banners = [];
    showLoadingIndicator = true;
    isMobileView = false;
    showNavigationArrows = false;
    @Input() pagina = 'futebol';
    @Input() showSkeleton = false;

    constructor(
        private cd: ChangeDetectorRef,
        private bannerService: BannerService,
        private messageService: MessageService,
        private config: NgbCarouselConfig
    ) {
        config.interval = 5000;
        config.showNavigationIndicators = false;
        config.keyboard = false;
        config.pauseOnHover = false;
    }

    ngOnInit(): void {
        this.showLoadingIndicator = true;
        this.bannerService.requestBanners(this.pagina);

        this.bannerService.banners.subscribe(banners => {
            this.showLoadingIndicator = true;
            this.banners = [];
            let source = 'src';

            if (window.innerWidth <= 667) {
                source = 'src_mobile';
                this.isMobileView = true;
            }

            for (const banner of banners) {
                if (banner[source]) {
                    this.banners.push(banner);
                }
            }

            if (this.banners.length > 1) {
                this.showNavigationArrows = true;
            }

            setTimeout(()=>{
                this.showLoadingIndicator = false;
            },2000);
            this.cd.markForCheck();
        });
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
