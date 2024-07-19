import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RifaGuard } from '../shared/services/guards/rifa.guard';
import { WallComponent } from './wall/wall.component';
import {ViewComponent} from './view/view.component';
import {RifaLayoutComponent} from '../shared/layout/app-layouts';

const routes: Routes = [{

    path: '',
    component: RifaLayoutComponent,
    // canActivateChild: [RifaGuard],
    children: [

        {
            path: '',
            redirectTo: 'wall',
            pathMatch: 'full'
        },
        {
            path: 'show/:id',
            component: ViewComponent
        },
        {
            path: 'wall',
            component: WallComponent
        }]
}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RifasRoutingModule { }
