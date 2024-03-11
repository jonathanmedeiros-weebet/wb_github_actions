import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RifaGuard } from '../shared/services/guards/rifa.guard';
import { WallComponent } from './wall/wall.component';

const routes: Routes = [

      {
        path: '',
        redirectTo: 'wall',
        pathMatch: 'full'
    },
    {
        path: 'wall',
        component: WallComponent,
        canActivate: [RifaGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RifasRoutingModule { 

  
}
