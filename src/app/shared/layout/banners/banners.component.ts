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
    bannersModal = [];
    showLoadingIndicator = true;
    isMobileView = false;
    showNavigationArrows = false;
    showNavigationArrowsInModal = false;
    @Input() pagina = 'futebol';
    @Input() showSkeleton = false;
    @Input() type = 'banner';
    @Input() isModal = false;

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
        if (window.innerWidth <= 667) {
            this.isMobileView = true;
        }
        if (!this.isModal) {
            this.loadBanner();
        } else {
            this.loadBannerModal();
        }
    }

    loadBanner() {
        this.banners = [];
        this.showLoadingIndicator = true;
        
        this.bannerService.requestBanners(this.pagina);
        this.bannerService.banners.subscribe(banners => {
        
            this.showLoadingIndicator = true;
            
            let source = 'src';
            this.isMobileView && (source = 'src_mobile');
            
            for (const banner of banners) {
                if (banner[source] && !(banner['pagina'] === 'deposito' && this.isMobileView)) {
                    this.banners.push(banner);
                }
            }
            if (this.banners.length > 1) {
                this.showNavigationArrows = true;
            }
            this.showLoadingIndicator = false;      
            this.cd.markForCheck();    
        });
    }

    loadBannerModal() {
        this.bannersModal = [];
        this.showLoadingIndicator = true;

        this.bannerService.requestBanners(this.pagina);
        this.bannerService.banners.subscribe(banners => {

            this.showLoadingIndicator = true;
            
            let source = 'src';
            this.isMobileView && (source = 'src_mobile');

            for (const banner of banners ) {
                if (banner[source] && banner['pagina'] === 'deposito') {
                    this.bannersModal.push(banner);
                }
            }

            if (this.bannersModal.length > 1) {
                this.showNavigationArrowsInModal = true;
            }
            
            this.showLoadingIndicator = false;
            this.cd.markForCheck();
        });
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
