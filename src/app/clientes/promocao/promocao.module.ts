import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocaoComponent } from './promocao.component';
import { RolloverComponent } from './rollover/rollover.component';
import { RodadaGratisComponent } from './rodada-gratis/rodada-gratis.component';
import { PromocaoRoutingModule } from './promocao-routing.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroService } from 'src/app/services';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    PromocaoComponent,
    RolloverComponent,
    RodadaGratisComponent
  ],
  imports: [
    CommonModule,
    PromocaoRoutingModule,
    NgbModule,
    NgbNavModule,
    SharedModule
  ],
  providers: [
    FinanceiroService
  ],
})

export class PromocaoModule {}
