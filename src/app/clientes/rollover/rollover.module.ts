import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RolloverRoutingModule } from './rollover-routing.module';
import {RolloverComponent} from './rollover.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [RolloverComponent],
    imports: [
        SharedModule,
        CommonModule,
        RolloverRoutingModule
    ]
})
export class RolloverModule {
}
