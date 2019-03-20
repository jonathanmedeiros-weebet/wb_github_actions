import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import 'hammerjs';

import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

import * as moment from 'moment';
moment.locale('pt-BR');

// App routing
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';

// Core providers
import { LayoutModule } from './shared/layout/layout.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ParametrosLocaisService } from './services';
import { AngularSvgIconModule } from 'angular-svg-icon';

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
    { provide: LOCALE_ID, useValue: 'pt-BR' }
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        NgxSpinnerModule,
        NgbModule,
        AngularSvgIconModule,
        LayoutModule
    ],
    providers: [APP_TOKENS],
    bootstrap: [AppComponent]
})
export class AppModule { }
