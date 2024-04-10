import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocaoComponent } from './promocao.component';

const routes: Routes = [
    {
      path: '',
      component: PromocaoComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PromocaoRoutingModule {}