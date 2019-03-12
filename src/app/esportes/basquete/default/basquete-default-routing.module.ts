import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasqueteDefaultWrapperComponent } from './wrapper/basquete-default-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: BasqueteDefaultWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BasqueteDefaultRoutingModule { }
