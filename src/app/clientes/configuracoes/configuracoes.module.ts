import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConfiguracoesRoutingModule} from './configuracoes-routing.module';
import {ConfiguracoesComponent} from './configuracoes.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
    declarations: [ConfiguracoesComponent],
    imports: [
        SharedModule,
        CommonModule,
        ConfiguracoesRoutingModule,
        NgxChartsModule,
        NgxCurrencyModule
    ]
})
export class ConfiguracoesModule {
}
