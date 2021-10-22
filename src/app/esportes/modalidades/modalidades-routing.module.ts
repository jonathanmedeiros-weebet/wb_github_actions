import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsportesWrapperComponent } from '../wrapper/esportes-wrapper.component';

export const routes: Routes = [
    {
        path: '',
        component: EsportesWrapperComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('app/esportes/modalidades/pre-evento/pre-evento.module').then(m => m.PreEventoModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModalidadesRoutingModule { }
