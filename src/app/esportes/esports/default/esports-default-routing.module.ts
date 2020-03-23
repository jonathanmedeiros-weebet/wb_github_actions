import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsportsDefaultWrapperComponent } from './wrapper/esports-default-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: EsportsDefaultWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EsportsDefaultRoutingModule { }
