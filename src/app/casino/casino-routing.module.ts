import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameviewComponent} from './gameview/gameview.component';
import {WallComponent} from './wall/wall.component';
import {CasinoWrapperComponent} from './wrapper/wrapper.component';
import {CasinoGuard} from '../shared/services/guards/casino.guard';
import {LiveComponent} from './live/live.component';
import {CassinoLayoutComponent, VirtuaisLayoutComponent} from '../shared/layout/app-layouts';

const routes: Routes = [
    {
        path: 'c',
        component: CassinoLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'wall/destaques',
                        pathMatch: 'full'
                    },
                    {
                        path: 'wall',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: 'live',
                        component: LiveComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: 'wall/:game_type',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: 'play/:game_mode/:game_id',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard]
                    }
                ]
            }
        ]
    },
    {
        path: 'v',
        component: VirtuaisLayoutComponent,
        children: [
            {
                path: '',
                component: CasinoWrapperComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'wall/virtuais',
                        pathMatch: 'full'
                    },
                    {
                        path: 'wall/:game_type',
                        component: WallComponent,
                        canActivate: [CasinoGuard]
                    },
                    {
                        path: 'play/:game_mode/:game_id',
                        component: GameviewComponent,
                        canActivate: [CasinoGuard]
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
