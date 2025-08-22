import { enableProdMode, inject } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ServiceWorkerService } from './app/shared/services/service-worker.service';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));

(async () => {
    const serviceWorker = new ServiceWorkerService();
    await serviceWorker.unregisterServiceWorker();
    await serviceWorker.cleanupServiceWorker();

    if (serviceWorker.isPWAInstalled()) {
        await serviceWorker.registerServiceWorker();
    } else {
        await serviceWorker.registerMinimalServiceWorker();
    }
})();
