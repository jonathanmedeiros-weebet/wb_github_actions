import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/app-layouts/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/app-layouts/main-layout.component';

import { AuthGuard, LoteriaGuard, DesafioGuard } from './services';
import { CupomComponent } from './cupom/cupom.component';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'esportes/futebol/jogos',
                pathMatch: 'full'
            },
            {
                path: 'acumuladao',
                loadChildren: () => import('app/acumuladao/acumuladao.module').then(m => m.AcumuladaoModule),
            },
            {
                path: 'apuracao',
                loadChildren: () => import('app/apuracao/apuracao.module').then(m => m.ApuracaoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'cartoes',
                loadChildren: () => import('app/cartao/cartao.module').then(m => m.CartaoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'desafios',
                loadChildren: () => import('app/desafios/desafios.module').then(m => m.DesafiosModule),
                canActivate: [DesafioGuard]
            },
            {
                path: 'esportes',
                loadChildren: () => import('app/esportes/esportes.module').then(m => m.EsportesModule)
            },
            {
                path: 'informacoes',
                loadChildren: () => import('./informacoes/informacoes.module').then(m => m.InformacoesModule)
            },
            {
                path: 'loterias',
                loadChildren: () => import('app/loterias/loterias.module').then(m => m.LoteriasModule),
                canActivate: [LoteriaGuard]
            },
            {
                path: 'resultados',
                loadChildren: () => import('app/resultados/resultados.module').then(m => m.ResultadosModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'meu-perfil',
                loadChildren: () => import('app/meu-perfil/meu-perfil.module').then(m => m.MeuPerfilModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'validar-aposta',
                loadChildren: () => import('app/validar-aposta/validar-aposta.module').then(m => m.ValidarApostaModule),
                canActivate: [AuthGuard]
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: () => import('app/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'bilhete/:chave',
        component: CupomComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        scrollPositionRestoration: 'enabled',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
