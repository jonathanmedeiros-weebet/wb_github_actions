import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent, AuthLayoutComponent, BetbyLayoutComponent } from './shared/layout/app-layouts';

import { AoVivoGuard, AuthGuard, DesafioGuard, LoteriaGuard } from './services';
import { CupomComponent } from './cupom/cupom.component';
import { ClientGuard } from './shared/services/guards/client.guard';
import { CambistaGuard } from './shared/services/guards/cambista.guard';
import { WelcomeGuard } from './shared/services/guards/welcome.guard';
import { AppComponent } from './app.component';
import { HomeGuard } from './shared/services/guards/home.guard';
import { WelcomePageComponent } from './shared/layout/welcome-page//welcome-page.component';
import { BetbyComponent } from './betby/betby.component';
import {RifaGuard} from './shared/services/guards/rifa.guard';
import { RedirectBetGuardGuard } from './shared/services/guards/redirect-bet-guard.guard';

const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                canActivate: [HomeGuard],
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
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
                path: 'esqueceu-senha',
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
                path: '',
                loadChildren: () => import('./casino/casino.module').then(m => m.CasinoModule)
            },
            {
                path: 'esportes',
                loadChildren: () => import('./esportes/esportes.module').then(m => m.EsportesModule)
            },
            {
                path: 'live',
                loadChildren: () => import('./esportes/live/live.module').then(m => m.LiveModule),
                canActivate: [AoVivoGuard]
            },
            {
                path: 'informacoes',
                loadChildren: () => import('./informacoes/informacoes.module').then(m => m.InformacoesModule)
            },
            {
                path: 'promocao',
                loadChildren: () => import('./promocoes/promocoes.module').then(m => m.PromocoesModule)
            },
            {
                path: 'loterias',
                loadChildren: () => import('./loterias/loterias.module').then(m => m.LoteriasModule),
                canActivate: [LoteriaGuard]
            },
            {
                path: 'rifas',
                loadChildren: () => import('./rifas/rifas.module').then(m => m.RifasModule),
                canActivate: [RifaGuard]
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
                path: 'ultimos-acessos',
                loadChildren: () => import('./acessos-clientes/last-accesses.module').then(m => m.LastAccessesModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'bank-accounts',
                loadChildren: () => import('./bank-accounts/bank-accounts.module').then(m => m.BankAccountsModule),
                canActivate: [AuthGuard, ClientGuard]
            },
            {
                path: 'validar-aposta',
                loadChildren: () => import('./validar-aposta/validar-aposta.module').then(m => m.ValidarApostaModule),
                canActivate: [AuthGuard, CambistaGuard]
            },
            {
                path: 'copiar-aposta',
                loadChildren: () => import('./copiar-aposta/copiar-aposta.module').then(m => m.CopiarApostaModule),
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
        path: 'sports',
        component: BetbyLayoutComponent,
        children: [
            {
                path: '**',
                component: BetbyComponent
            }
        ]
    },
    {
        path: 'bilhete/:codigo',
        component: CupomComponent
    },
    {
        path: 'aposta/:codigo',
        component: CupomComponent,
        canActivate: [RedirectBetGuardGuard]
    },
    {
        path: 'welcome',
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
