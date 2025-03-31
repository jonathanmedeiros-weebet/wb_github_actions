import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccountVerificationGuard } from './guards/account-verification.guard';

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

  verifyIfCurrentRouteUseAccountVerificationGuard(): Promise<boolean> {
    return new Promise((resolve) => {
      this.router.events
      .pipe(
        filter(() => !!this.router.routerState.snapshot.root),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const hasGuard = this.hasTesteGuard(this.router.routerState.snapshot.root);
        resolve(hasGuard)
      });
    })
  }

  private hasTesteGuard(routeSnapshot: ActivatedRouteSnapshot): boolean {
    if (routeSnapshot.routeConfig?.canActivate?.includes(AccountVerificationGuard)) {
      return true;
    }

    for (const child of routeSnapshot.children) {
      if (this.hasTesteGuard(child)) {
        return true;
      }
    }

    return false;
  }
}

