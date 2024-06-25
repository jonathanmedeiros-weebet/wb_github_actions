import { NgModule, LOCALE_ID, APP_INITIALIZER, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from './shared/shared.module';

import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

import * as moment from 'moment';
moment.updateLocale('pt-bt', { parentLocale: 'pt-br' });

// App routing
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';

// Core providers
import { LayoutModule } from './shared/layout/layout.module';
import { CupomModule } from './cupom/cupom.module';
import { ParametrosLocaisService } from './services';

import { ToastrModule } from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// Translation Modules
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';

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

export function googleFactory(service: ParametrosLocaisService) {
    const googleClientId = service.getOpcoes().login_google_client_id;

    return {
        autoLogin: false,
        providers: [
            {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                    googleClientId
                )
            }
        ],
        onError: (err) => {
            console.error(err);
        }
    } as SocialAuthServiceConfig
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        NgxSkeletonLoaderModule.forRoot({ loadingText: 'This item is actually loading...' }),
        AppRoutingModule,
        SocialLoginModule,
        LayoutModule,
        CupomModule,
        ToastrModule.forRoot({
            timeOut: 7000
        }),
        NgxPaginationModule,
        SharedModule
    ],
    providers: [
        APP_TOKENS,
        {
            provide: 'SocialAuthServiceConfig',
            useFactory: googleFactory,
            deps: [ParametrosLocaisService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './locale/i18n/', '.json');
}
