import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PixFormComponent} from './pix-form/pix-form.component';
import {PixResultComponent} from './pix-result/pix-result.component';

const routes: Routes = [
    {
        path: '',
        component: PixFormComponent
    },
    {
        path: 'result',
        component: PixResultComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoPixRoutingModule {
}
