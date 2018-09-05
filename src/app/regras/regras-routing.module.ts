import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegrasComponent } from './regras.component';

export const routes: Routes = [
    { path: '', component: RegrasComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegrasRoutingModule { }
