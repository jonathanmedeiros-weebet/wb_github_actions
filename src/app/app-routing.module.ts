import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/app-layouts/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/app-layouts/main-layout.component';

import { AuthGuard } from './services';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        data: {
            pageTitle: 'Dashboard'
        },
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadChildren: 'app/+home/home.module#HomeModule',
                data: {
                    pageTitle: 'Home'
                }
            },
            {
                path: 'apuracao',
                loadChildren: 'app/+apuracao/apuracao.module#ApuracaoModule',
                data: {
                    pageTitle: 'Apuração'
                }
            },
            {
                path: 'futebol',
                loadChildren: 'app/+futebol/futebol.module#FutebolModule',
                data: {
                    pageTitle: 'Futebol'
                }
            },
            {
                path: 'resultados',
                loadChildren: 'app/+resultados/resultados.module#ResultadosModule',
                data: {
                    pageTitle: 'Resultados'
                }
            },
            {
                path: 'seninha',
                loadChildren: 'app/+seninha/seninha.module#SeninhaModule',
                data: {
                    pageTitle: 'Seninha'
                }
            },
            {
                path: 'quininha',
                loadChildren: 'app/+quininha/quininha.module#QuininhaModule',
                data: {
                    pageTitle: 'Quininha'
                }
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: 'app/+auth/auth.module#AuthModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
