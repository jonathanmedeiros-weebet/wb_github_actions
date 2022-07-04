import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AcumuladaoListagemComponent} from './acumuladao-listagem/acumuladao-listagem.component';
import {AcumuladaoFormComponent} from './acumuladao-form/acumuladao-form.component';
import {AcumuladaoLayoutComponent} from '../shared/layout/app-layouts/acumuladao-layout.component';

const routes: Routes = [
    {
        path: '',
        component: AcumuladaoLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'listagem',
                pathMatch: 'full'
            },
            {
                path: 'listagem',
                component: AcumuladaoListagemComponent
            },
            {
                path: 'form/:id',
                component: AcumuladaoFormComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AcumuladaoRoutingModule { }
