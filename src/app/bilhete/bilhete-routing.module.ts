import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BilheteComponent } from './bilhete.component';

const routes: Routes = [
    {
        path: '',
        component: BilheteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [],
    declarations: [],
})
export class BilheteRoutingModule { }
