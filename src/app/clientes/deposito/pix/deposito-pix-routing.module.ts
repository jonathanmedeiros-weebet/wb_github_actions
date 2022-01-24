import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoPixFormComponent} from './form/deposito-pix-form.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoPixFormComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoPixRoutingModule {
}
