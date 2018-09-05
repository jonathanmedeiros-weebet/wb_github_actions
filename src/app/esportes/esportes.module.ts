import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { EsportesRoutingModule } from './esportes-routing.module';

@NgModule({
    imports: [SharedModule, EsportesRoutingModule],
    declarations: [],
    providers: []
})
export class EsportesModule { }
