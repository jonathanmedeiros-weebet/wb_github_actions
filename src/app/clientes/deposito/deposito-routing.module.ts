import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DepositoComponent} from './deposito.component';

const routes: Routes = [
    {
        path: '',
        component: DepositoComponent,
        children: [
            {
                path: '',
                redirectTo: 'pix',
                pathMatch: 'full'
            },
            {
                path: 'pix',
                loadChildren: () => import('./deposito-pix/deposito-pix.module').then(m => m.DepositoPixModule)
            },
            {
                path: 'whatsapp',
                loadChildren: () => import('./deposito-whatsapp/deposito-whatsapp.module').then(m => m.DepositoWhatsappModule)
            },
            {
                path: 'boleto',
                loadChildren: () => import('./deposito-boleto/deposito-boleto.module').then(m => m.DepositoBoletoModule)
            },
            {
                path: 'cartao',
                loadChildren: () => import('./deposito-cartao/deposito-cartao.module').then(m => m.DepositoCartaoModule)
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepositoRoutingModule {
}
