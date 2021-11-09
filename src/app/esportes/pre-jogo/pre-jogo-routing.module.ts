import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreJogoWrapperComponent } from './wrapper/pre-jogo-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: PreJogoWrapperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PreJogoRoutingModule { }
