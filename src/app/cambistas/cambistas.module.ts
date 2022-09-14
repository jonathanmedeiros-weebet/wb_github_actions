import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CambistasRoutingModule} from './cambistas-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        SharedModule,
        CambistasRoutingModule,
        NgbModule
    ]
})
export class CambistasModule {
}
