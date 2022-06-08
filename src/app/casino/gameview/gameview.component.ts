import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {MenuFooterService} from '../../services';
import {interval} from 'rxjs';


@Component({
  selector: 'app-gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.css']
})
export class GameviewComponent implements OnInit, OnDestroy {
  gameUrl: SafeUrl;
  gameId: String = '';
  gameMode: String = '';
  params: any = [];
  mobileScreen;
  fullscreen;
  elem: any;
  showLoadingIndicator = true;

constructor(
    private casinoApi: CasinoApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private menuFooterService: MenuFooterService,
    @Inject(DOCUMENT) private document: any
) {
}

ngOnInit(): void {
    this.elem = document.documentElement;
    this.mobileScreen = window.innerWidth <= 1024 ? true : false;
    this.fullscreen = false;
    this.menuFooterService.setIsPagina(true);
    this.route.params.subscribe(params => {
    this.params = params;
    this.gameId = params['game_id'];
    this.gameMode = params['game_mode'];
    this.loadGame();
        interval(3000)
            .subscribe(() => {
                this.showLoadingIndicator = false;
            });
    });

  }

  loadGame() {
    this.casinoApi.getGameUrl(this.gameId, this.gameMode).subscribe(response => {
      this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
    });
  }

    back(): void {
        this.location.back();
        this.closeFullscreen();
    }

    ngOnDestroy() {
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }
    }

    openFullscreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
            /* Firefox */
            this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            /* IE/Edge */
            this.elem.msRequestFullscreen();
        }
        this.fullscreen = true;
    }

    closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
        this.fullscreen = false;
    }

    isAppMobile() {
        let result = false;
        const appMobile = JSON.parse(localStorage.getItem('app-mobile'));
        if (appMobile) {
            result = appMobile;
        }
        return result;
    }


}
