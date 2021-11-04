import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PixFormComponent} from './pix-form/pix-form.component';

const routes: Routes = [
    {
        path: '',
        component: PixFormComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoPixRoutingModule {
}
