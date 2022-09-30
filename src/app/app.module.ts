import {NgModule, LOCALE_ID, APP_INITIALIZER, DEFAULT_CURRENCY_CODE} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';

import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

import * as moment from 'moment';
moment.locale('pt-BR');

// App routing
import {AppRoutingModule} from './app-routing.module';

// App is our top level component
import {AppComponent} from './app.component';

// Core providers
import {LayoutModule} from './shared/layout/layout.module';
import {CupomModule} from './cupom/cupom.module';
import {ParametrosLocaisService} from './services';

import {ToastrModule} from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

export function paramsServiceFactory(service: ParametrosLocaisService) {
    return () => service.load();
}

export const APP_TOKENS = [
    {
        provide: APP_INITIALIZER,
        useFactory: paramsServiceFactory,
        deps: [ParametrosLocaisService],
        multi: true
    },
    {
        provide: LOCALE_ID,
        useValue: environment.locale
    },
    {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: environment.currencyCode
    }
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSkeletonLoaderModule.forRoot({ loadingText: 'This item is actually loading...' }),
        AppRoutingModule,

        LayoutModule,
        CupomModule,
        ToastrModule.forRoot({
            timeOut: 7000
        }),
    ],
    providers: [APP_TOKENS],
    bootstrap: [AppComponent]
})
export class AppModule {
}
