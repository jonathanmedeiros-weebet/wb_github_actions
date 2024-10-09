import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CarteiraRoutingModule} from './carteira-routing.module';
import {CarteiraComponent} from './carteira.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxCurrencyModule} from 'ngx-currency';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
    declarations: [CarteiraComponent],
    imports: [
        SharedModule,
        CommonModule,
        CarteiraRoutingModule,
        NgxCurrencyModule,
        NgbModule,
        NgxMaskModule.forRoot(),
    ],
})
export class Carteira {
}
