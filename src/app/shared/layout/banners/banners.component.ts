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
    isMobileView = false;
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
        this.bannerService.getBanners(this.pagina).subscribe(
            banners => {

                let bannerObj;

                console.log(this.pagina);

                switch (this.pagina) {
                    case 'futsal':
                        bannerObj = {
                            title: 'titulo da imagem',
                            src: 'https://souesportista.decathlon.com.br/wp-content/uploads/2017/09/blog-eventos-banner-futsal.png'
                        };
                        break;
                    case 'volei':
                        bannerObj = {
                            title: 'titulo da imagem',
                            src: 'https://s3.amazonaws.com/assets-fluminense/posts/7619/f0c5b18b-26da-4ee4-92ac-ad57a586a9ee_banner.jpg?1639178356'
                        };
                        break;
                    case 'basquete':
                        bannerObj = {
                            title: 'titulo da imagem',
                            src: 'https://i.pinimg.com/736x/5c/1b/a9/5c1ba92ad6b969e7fae7a02a6aeebec0.jpg'
                        };
                        break;
                    case 'combate':
                        bannerObj = {
                            title: 'titulo da imagem',
                            src: 'https://images.squarespace-cdn.com/content/v1/5e0ce9f25e2b2a5ae528f495/1579216633514-UVG1V5LISBGY8B383OQD/frm+banner+3.jpg'
                        };
                        break;
                    default:
                        bannerObj = {
                            title: 'titulo da imagem',
                            src: 'https://png.pngtree.com/thumb_back/fw800/back_our/20190621/ourmid/pngtree-football-colorful-game-poster-banner-background-image_194132.jpg'
                        };
                        break;
                }


                this.banners = [
                    bannerObj
                ];
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

                this.cd.markForCheck();
            },
            error => this.handleError(error)
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
