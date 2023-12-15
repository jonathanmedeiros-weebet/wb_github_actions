import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PromocaoComponent } from './promocao.component';
import { PromocaoFormComponent } from './list-promocao/promocao-form/promocao-form.component';

console.log("Rotas");

const routes: Routes = [
    {
      path: '',
      component: PromocaoComponent,
      children: [
        {
          path: 'list/:id',
          component: PromocaoFormComponent,
        }
      ]
    }
  ];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PromocaoRoutingModule { }
