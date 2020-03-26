import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesafiosWrapperComponent } from './desafios-wrapper/desafios-wrapper.component';

const routes: Routes = [
    { path: '', component: DesafiosWrapperComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DesafiosRoutingModule { }
