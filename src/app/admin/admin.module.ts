import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    imports: [SharedModule, AdminRoutingModule],
    declarations: [AdminDashboardComponent],
    providers: [],
})
export class AdminModule { }
