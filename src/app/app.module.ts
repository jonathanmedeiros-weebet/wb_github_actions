import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

// App routing
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';

// Core providers
import { LayoutModule } from './shared/layout/layout.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,

        AppRoutingModule,

        NgbModule,
        LayoutModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
