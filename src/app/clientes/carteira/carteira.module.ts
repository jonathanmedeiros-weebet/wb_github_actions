import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteiraRoutingModule } from './carteira-routing.module';
import { CarteiraComponent } from './carteira.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
    declarations: [CarteiraComponent],
    imports: [
        SharedModule,
        CommonModule,
        CarteiraRoutingModule,
        NgxCurrencyDirective,
        NgbModule,
        NgxMaskDirective,
        NgxMaskPipe,
    ],
    providers: [provideNgxMask()]
})
export class Carteira {
}
