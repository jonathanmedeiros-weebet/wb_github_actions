import {Component, OnInit, ChangeDetectorRef, Input, HostListener} from '@angular/core';
import {BannerService, MessageService} from '../../../services';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {filter, take} from 'rxjs/operators';
import { xor } from 'lodash';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.css'],
    providers: [NgbCarouselConfig]
})
export class BannersComponent implements OnInit {
    banners = [];
    hideBanner = false;
    mobileScreen: boolean;

    showLoadingIndicator = true;
    showNavigationArrows = false;
    @Input() pagina = 'futebol';

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
        this.mobileScreen = window.innerWidth <= 1024;
        this.loadBanner();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.mobileScreen = event.target.innerWidth <= 1024;
    }

    loadBanner() {
        this.banners = [];
        this.showLoadingIndicator = true;
        this.bannerService.requestBanners();
        this.bannerService.banners
        .pipe(filter(banners => typeof banners != 'undefined'),take(1))
        .subscribe((banners: []) => {
            if (banners.length == 0) {
                this.hideBanner = true;
                return;
            }
            this.showLoadingIndicator = true;

            let source = 'src';
            if (this.mobileScreen) {
                source = 'src_mobile';
            }

            for (const banner of banners) { 
                if (banner[source]) {
                    if (this.pagina === 'deposito' && banner['pagina'] === 'deposito') {
                        this.banners.push(banner);
                    } else if (banner['pagina'] === this.pagina || (banner['pagina'] === 'todas' && !['deposito', 'cadastro'].includes(this.pagina))) {
                        this.banners.push(banner);
                    }
                }
            }

            if (this.banners.length > 1) {
                this.showNavigationArrows = true;
            } else if (this.banners.length == 0) {
                this.hideBanner = true;
                return;
            }

            this.showLoadingIndicator = false;
            this.cd.markForCheck();
        });
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
