import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameviewComponent } from './gameview/gameview.component';
import { WallComponent } from './wall/wall.component';
import { CasinoWrapperComponent } from './wrapper/wrapper.component';
import { CasinoGuard } from '../shared/services/guards/casino.guard';
import { CassinoLayoutComponent, CassinoLiveLayoutComponent, VirtuaisLayoutComponent } from '../shared/layout/app-layouts';
import { AccountVerificationGuard } from '../shared/services/guards/account-verification.guard';

const routes: Routes = [
    {
        path: 'casino',
        component: CassinoLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        component: WallComponent,
                        pathMatch: 'full',
                        canActivate: [CasinoGuard],
                    },
                    {
                        path: ':game_fornecedor',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: ':game_fornecedor/:game_id',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    },
                    {
                        path: ':game_fornecedor/:game_id/:game_mode',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    },
                    {
                        path: 'wallFiltered',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    }
                ]
            }
        ]
    },
    {
        path: 'live-casino',
        component: CassinoLiveLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        component: WallComponent,
                        pathMatch: 'full',
                        canActivate: [CasinoGuard],
                    },
                    {
                        path: ':game_fornecedor',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: ':game_fornecedor/:game_id',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    },
                    {
                        path: ':game_fornecedor/:game_id/:game_mode',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    }
                ]
            }
        ]
    },
    {
        path: 'virtual-sports',
        component: VirtuaisLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        component: WallComponent,
                        data: { virtual_sports: true },
                        pathMatch: 'full',
                        canActivate: [CasinoGuard],
                    },
                    {
                        path: ':game_fornecedor/:game_id',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    },
                    {
                        path: ':game_fornecedor/:game_id/:game_mode',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    }
                ]
            }
        ]
    },
    {
        path: 'parlaybay',
        component: VirtuaisLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard, AccountVerificationGuard]
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CasinoRoutingModule {
}
