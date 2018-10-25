import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/app-layouts/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/app-layouts/main-layout.component';
import { AdminLayoutComponent } from './shared/layout/app-layouts/admin-layout.component';

import { AuthGuard, ExpiresGuard } from './services';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        data: {
            pageTitle: 'Dashboard'
        },
        children: [
            {
                path: '',
                redirectTo: 'esportes/futebol/jogos',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: 'app/home/home.module#HomeModule'
            },
            {
                path: 'esportes',
                loadChildren: 'app/esportes/esportes.module#EsportesModule'
            },
            {
                path: 'loterias',
                loadChildren: 'app/loterias/loterias.module#LoteriasModule'
            },
            {
                path: 'meu-perfil',
                loadChildren: 'app/meu-perfil/meu-perfil.module#MeuPerfilModule',
                canActivate: [AuthGuard],
                canActivateChild: [ExpiresGuard]
            },
            {
                path: 'regras',
                loadChildren: 'app/regras/regras.module#RegrasModule',
                data: {
                    pageTitle: 'Regras'
                }
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: 'app/auth/auth.module#AuthModule'
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        loadChildren: 'app/admin/admin.module#AdminModule',
        canActivate: [AuthGuard],
        canActivateChild: [ExpiresGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
