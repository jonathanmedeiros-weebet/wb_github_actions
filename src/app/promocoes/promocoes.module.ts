import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocaoComponent } from './promocao.component';
import { PromocaoRoutingModule } from './promocao-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PromocoesService } from '../services';
import { PromocaoFormComponent } from './list-promocao/promocao-form/promocao-form.component';

@NgModule({
  declarations: [
    PromocaoComponent,
    PromocaoFormComponent
  ],
  imports: [
    CommonModule,
    PromocaoRoutingModule,
    SharedModule
  ],
  providers: [
    PromocoesService
  ]
})
export class PromocoesModule { }
