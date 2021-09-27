import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientesComponent} from './clientes.component';

const routes: Routes = [{
    path: '',
    component: ClientesComponent,
    children: [
        {
            path: '',
            redirectTo: 'perfil',
            pathMatch: 'full'
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientesRoutingModule {
}
