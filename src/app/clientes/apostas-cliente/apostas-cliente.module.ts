import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApostasClienteRoutingModule} from './apostas-cliente-routing.module';
import {ApostasClienteComponent} from './apostas-cliente.component';
import {SharedModule} from '../../shared/shared.module';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [ApostasClienteComponent],
    imports: [
        SharedModule,
        CommonModule,
        ApostasClienteRoutingModule,
        NgbNavModule
    ]
})
export class ApostasClienteModule {
}
