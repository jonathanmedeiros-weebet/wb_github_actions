import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesLayoutComponent } from '../shared/layout/app-layouts';
import { BankAccountsComponent } from './bank-accounts.component';

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
export class BankAccountsRoutingModule {}
