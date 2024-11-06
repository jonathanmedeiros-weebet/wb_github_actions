import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;
  private category: string | null = null;
  private provider: string | null = null;

  private limparFiltroSource = new Subject<void>();
  limparFiltro$ = this.limparFiltroSource.asObservable();

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getCategory() {
    return this.category;
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public getProvider() {
    return this.provider;
  }

  public setProvider(provider: string) { 
    this.provider = provider;
  }

  emitClearFilters() {
    this.limparFiltroSource.next();
  }
}
