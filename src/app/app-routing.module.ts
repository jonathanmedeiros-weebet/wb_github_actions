import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainLayoutComponent, AuthLayoutComponent} from './shared/layout/app-layouts';

import {AuthGuard, DesafioGuard, LoteriaGuard} from './services';
import {CupomComponent} from './cupom/cupom.component';
import {ClientGuard} from './shared/services/guards/client.guard';
import {CambistaGuard} from './shared/services/guards/cambista.guard';
import { WelcomeGuard } from './shared/services/guards/welcome.guard';
import { AppComponent } from './app.component';
import { HomeGuard } from './shared/services/guards/home.guard';
import { WelcomePageComponent } from './shared/layout/welcome-page//welcome-page.component';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: AppComponent,
                canActivate: [HomeGuard]
            },
            {
                path: 'cadastro',
                component: AppComponent
            },
            {
                path: 'auth/cadastro',
                component: AppComponent
            },
            {
                path: 'login',
                component: AppComponent
            },
            {
                path: 'acumuladao',
                loadChildren: () => import('./acumuladao/acumuladao.module').then(m => m.AcumuladaoModule),
            },
            {
                path: 'apuracao',
                loadChildren: () => import('./apuracao/apuracao.module').then(m => m.ApuracaoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'cartoes',
                loadChildren: () => import('./cartao/cartao.module').then(m => m.CartaoModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'desafios',
                loadChildren: () => import('./desafios/desafios.module').then(m => m.DesafiosModule),
                canActivate: [DesafioGuard]
            },
            {
                path: 'casino',
                loadChildren: () => import('./casino/casino.module').then(m => m.CasinoModule)
            },
            {
                path: 'esportes',
                loadChildren: () => import('./esportes/esportes.module').then(m => m.EsportesModule)
            },
            {
                path: 'informacoes',
                loadChildren: () => import('./informacoes/informacoes.module').then(m => m.InformacoesModule)
            },
            {
                path: 'loterias',
                loadChildren: () => import('./loterias/loterias.module').then(m => m.LoteriasModule),
                canActivate: [LoteriaGuard]
            },
            {
                path: 'resultados',
                loadChildren: () => import('./resultados/resultados.module').then(m => m.ResultadosModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'alterar-senha',
                loadChildren: () => import('./meu-perfil/alterar-senha.module').then(m => m.AlterarSenhaModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'validar-aposta',
                loadChildren: () => import('./validar-aposta/validar-aposta.module').then(m => m.ValidarApostaModule),
                canActivate: [AuthGuard, CambistaGuard]
            },
            {
                path: 'auth',
                component: AuthLayoutComponent,
                loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
            },
            {
                path: 'clientes',
                canActivate: [AuthGuard, ClientGuard],
                loadChildren: () => import('./clientes/clientes.module').then(c => c.ClientesModule)
            },
            {
                path: 'cambistas',
                canActivate: [AuthGuard, CambistaGuard],
                loadChildren: () => import('./cambistas/cambistas.module').then(c => c.CambistasModule)
            }
        ]
    },
    {
        path: 'bilhete/:codigo',
        component: CupomComponent
    },
    {
        path:'welcome',
        component: WelcomePageComponent,
        canActivate: [WelcomeGuard]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
    scrollPositionRestoration: 'enabled'
})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
