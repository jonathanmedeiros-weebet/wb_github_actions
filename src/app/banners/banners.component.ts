import { Component, OnInit } from '@angular/core';
import { BannerService, MessageService } from './../services';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css'],
    providers: [NgbCarouselConfig]
})
export class BannersComponent implements OnInit {
    banners = [];
    isMobileView = false;
    showNavigationArrows = false;
    constructor(
        private bannerService: BannerService,
        private messageService: MessageService,
        private config: NgbCarouselConfig
    ) {
        config.interval = 10000;
        config.showNavigationIndicators = false;
        config.showNavigationArrows = true
        // config.wrap = true;
        config.keyboard = false;
        config.pauseOnHover = false;
    }

    ngOnInit(): void {
        this.bannerService.getBanners().subscribe(
            (banners) => {
                let bannersArray = [];

                if (window.innerWidth <= 667) {
                    this.isMobileView = true;
                    for (let banner of banners) {

                        if (banner.src_mobile) {

                            bannersArray.push(banner)
                        }

                    }
                    this.isMobileView = true;
                } else {
                    for (let banner of banners) {
                        if (banner.src) {
                            bannersArray.push(banner)
                        }
                    }
                }

                if (bannersArray.length > 0) {
                    this.banners = bannersArray;
                }

                if (this.banners.length > 1) {
                    this.showNavigationArrows = true;
                }
            },
            error => this.handleError(error)
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
