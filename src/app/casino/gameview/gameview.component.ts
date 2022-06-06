import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {MenuFooterService} from '../../services';


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

constructor(
    private casinoApi: CasinoApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private menuFooterService: MenuFooterService
) {
}

ngOnInit(): void {
    this.mobileScreen = window.innerWidth <= 1024 ? true : false;
    this.menuFooterService.setIsPagina(true);
    this.route.params.subscribe(params => {
    this.params = params;
    this.gameId = params['game_id'];
    this.gameMode = params['game_mode'];
    this.loadGame();
    });

  }

  loadGame() {
    this.casinoApi.getGameUrl(this.gameId, this.gameMode).subscribe(response => {
      this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.gameURL);
    });
  }

    back(): void {
        this.location.back();
    }

    ngOnDestroy() {
        if (this.mobileScreen) {
            this.menuFooterService.setIsPagina(false);
        } else {
            this.menuFooterService.setIsPagina(true);
        }
    }

}
