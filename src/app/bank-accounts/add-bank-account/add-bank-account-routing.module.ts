import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PagesLayoutComponent } from 'src/app/shared/layout/app-layouts';
import { AddBankAccountComponent } from './add-bank-account.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            {
                path: '',
                component: AddBankAccountComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddBankAccountRoutingModule {
}
