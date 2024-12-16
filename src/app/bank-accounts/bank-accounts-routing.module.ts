import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BankAccountsComponent} from './bank-accounts.component';
import {PagesLayoutComponent} from '../shared/layout/app-layouts';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: BankAccountsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BankAccountsRoutingModule {
}
