import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameviewComponent } from './gameview/gameview.component';
import { WallComponent } from './wall/wall.component';
import { CasinoWrapperComponent } from './wrapper/wrapper.component';
import {CasinoGuard} from '../shared/services/guards/casino.guard';

const routes: Routes = [
    {
        path: '',
        component: CasinoWrapperComponent,
        children: [
            {
                path: 'wall',
                component: WallComponent,
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CasinoRoutingModule { }
