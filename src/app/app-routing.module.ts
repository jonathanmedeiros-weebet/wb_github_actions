import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/app-layouts/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/app-layouts/main-layout.component';

import { AuthGuard, ExpiresGuard, ParametrosResolver } from './services';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        data: {
            pageTitle: 'Dashboard'
        },
        children: [
            // {
            //     path: '',
            //     redirectTo: 'esportes/futebol/jogos',
            //     pathMatch: 'full'
            // },
            {
                path: 'apuracao',
                loadChildren: 'app/apuracao/apuracao.module#ApuracaoModule',
                canActivate: [AuthGuard]
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
                path: 'resultados',
                loadChildren: 'app/resultados/resultados.module#ResultadosModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'meu-perfil',
                loadChildren: 'app/meu-perfil/meu-perfil.module#MeuPerfilModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'regras',
                loadChildren: 'app/regras/regras.module#RegrasModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'validar-aposta',
                loadChildren: 'app/validar-aposta/validar-aposta.module#ValidarApostaModule',
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: 'app/auth/auth.module#AuthModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
