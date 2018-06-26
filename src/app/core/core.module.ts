import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { throwIfAlreadyLoaded } from './module-import-guard';

// Providers
import {
    AuthService,
    AuthGuard,
    HeadersService,
    MessageService,
    ErrorService,
    HelperService,
    PrintService,
    ExpiresGuard
} from '../services';

import * as moment from 'moment';
moment.locale('pt-BR');

@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [],
    providers: [
        AuthService,
        AuthGuard,
        HeadersService,
        MessageService,
        ErrorService,
        HelperService,
        PrintService,
        ExpiresGuard,
        Title
    ]
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
