import { NgModule } from '@angular/core';

import { RegrasComponent } from './regras.component';
import { SharedModule } from '../shared/shared.module';
import { RegrasRoutingModule } from './regras-routing.module';
import { RegraService } from '../services';

@NgModule({
    imports: [SharedModule, RegrasRoutingModule],
    exports: [],
    declarations: [RegrasComponent],
    providers: [RegraService],
})
export class RegrasModule { }
