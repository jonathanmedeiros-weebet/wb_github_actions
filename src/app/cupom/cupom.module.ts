import { NgModule } from '@angular/core';

import { CupomComponent } from './cupom.component';
import { SharedModule } from '../shared/shared.module';
import { LiveService } from '../services';
import { CupomEsportesComponent } from './esportes/cupom-esportes.component';

@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        CupomComponent,
        CupomEsportesComponent
    ],
    providers: [LiveService]
})
export class CupomModule { }
