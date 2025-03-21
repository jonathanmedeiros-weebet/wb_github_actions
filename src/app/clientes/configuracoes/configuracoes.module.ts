import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';
import { ConfiguracoesComponent } from './configuracoes.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [ConfiguracoesComponent],
    imports: [
        SharedModule,
        CommonModule,
        ConfiguracoesRoutingModule,
        NgxChartsModule,
        NgxCurrencyDirective,
        NgbModule
    ]
})
export class ConfiguracoesModule {
}
