import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JogoService } from '../shared/services/aposta-esportiva/jogo.service';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CassinoComponent } from './widgets/cassino/cassino.component';
import { JogosAovivoComponent } from './widgets/jogos-aovivo/jogos-aovivo.component';
import { JogosDestaqueComponent } from './widgets/jogos-destaque/jogos-destaque.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BilheteComponent } from './bilhete/bilhete.component';
import { CasinoModule } from '../casino/casino.module';

@NgModule({
    declarations: [
        HomeComponent,
        CassinoComponent,
        JogosAovivoComponent,
        JogosDestaqueComponent,
        BilheteComponent,
    ],
    imports: [
        CasinoModule,
        CommonModule,
        SharedModule,
        NgbModule,
        HomeRoutingModule,
        CarouselModule,
    ],
    providers: [
        NgbActiveModal,
        JogoService
    ]
})
export class HomeModule {
}
