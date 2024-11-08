import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationHistoryService } from '../../../services/navigation-history.service';

@Component({
  selector: 'app-back-page',
  templateUrl: './back-page.component.html',
  styleUrls: ['./back-page.component.css']
})
export class BackPageComponent implements OnInit{
  @Input() showBtn: boolean = true;
  @Input() text: string = '';
  private category: string | null = null;
  private provider: string | null = null;
  private CASINO_IN_GAME_URL = '/casino/';
  private LIVE_CASINO_IN_GAME_URL = '/live-casino/';

  constructor(
    private navigationHistoryService: NavigationHistoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category = this.navigationHistoryService.getCategory();
    this.provider = this.navigationHistoryService.getProvider();
  }

  back() {
    let previousUrl = this.navigationHistoryService.getPreviousUrl();

    this.determineBaseUrlAndNavigate(previousUrl);
  }

  navigateBasedOnUrl(baseUrl: string, baseInGameUrl: string, previousUrl: string, provider: string | null, category: string | null): void {
    if (previousUrl === "/" && this.router.url.startsWith(baseInGameUrl)) {
        this.router.navigate([previousUrl]);
    } else if (!previousUrl && this.router.url.startsWith(baseInGameUrl)) {
        this.router.navigate([baseUrl]);
    } else if (
        (previousUrl === `/${baseUrl}` ||
            previousUrl.includes("?category=") ||
            previousUrl.includes("provider=")) &&
        this.router.url.startsWith(baseInGameUrl)
    ) {
        const params = {
            ...(provider ? { provider } : {}),
            ...(category ? { category } : {}),
        };
        this.router.navigate([baseUrl], { queryParams: params });
    } else if (
        this.router.url === `/${baseUrl}` ||
        previousUrl.includes("category=") ||
        previousUrl.includes("provider=") ||
        previousUrl.startsWith(`/${baseUrl}/`)
    ) {
        this.navigationHistoryService.emitClearFilters();
    }
  }

  determineBaseUrlAndNavigate(previousUrl: string): void {
    let baseUrl: string | null = null;
    let baseInGameUrl: string | null = null;
  
    if (this.router.url.startsWith('/casino')) {
      baseUrl = 'casino';
      baseInGameUrl = this.CASINO_IN_GAME_URL;
    } else if (this.router.url.startsWith('/live-casino')) {
      baseUrl = 'live-casino';
      baseInGameUrl = this.LIVE_CASINO_IN_GAME_URL;
    }
  
    if (baseUrl) {
      this.navigateBasedOnUrl(baseUrl, baseInGameUrl ,previousUrl, this.provider, this.category);
    }
  }
}
