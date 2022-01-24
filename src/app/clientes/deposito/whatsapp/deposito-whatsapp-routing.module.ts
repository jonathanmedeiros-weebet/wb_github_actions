import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoWhatsappComponent} from './deposito-whatsapp.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoWhatsappComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoWhatsappRoutingModule {
}
