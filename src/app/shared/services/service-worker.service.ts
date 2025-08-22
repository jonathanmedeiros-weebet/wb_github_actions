import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  public async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      return await navigator.serviceWorker.register('ngsw-worker.js');
    }
  }

  public async registerMinimalServiceWorker() {
    if ('serviceWorker' in navigator) {
      return await navigator.serviceWorker.register('ngsw-worker-minimal.js');
    }
  }

  public async unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        registrations.forEach(reg => reg.unregister());
      }
    }
  }

  public async cleanupServiceWorker() {
    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      if (cacheKeys.length > 0) {
        cacheKeys.forEach(key => caches.delete(key));
      }
    }
  }

  public isPWAInstalled(): boolean {
    return (window.matchMedia('(display-mode: standalone)').matches) || Boolean((window.navigator as any).standalone);
  }
}