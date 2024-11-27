import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LastAccessesRoutingModule } from './last-accesses-routing.module';
import { LastAccessesComponent } from './last-accesses.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {WeePaginationModule} from '../weebet-pagination/wee-pagination.module';

@NgModule({
    imports: [SharedModule, LastAccessesRoutingModule, TranslateModule, NgbInputDatepicker, WeePaginationModule],
    declarations: [LastAccessesComponent],
    providers: []
})
export class LastAccessesModule { }
