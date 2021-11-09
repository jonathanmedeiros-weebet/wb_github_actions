import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { PreJogoRoutingModule } from './pre-jogo-routing.module';
import { PreJogoWrapperComponent } from './wrapper/pre-jogo-wrapper.component';
import { PreJogoListagemComponent } from './listagem/pre-jogo-listagem.component';
import { PreJogoVisualizacaoComponent } from './visualizacao/pre-jogo-visualizacaocomponent';
import { BannersComponent } from './../../banners/banners.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { JogoService, BilheteEsportivoService, ApostaEsportivaService } from '../../services';

@NgModule({
    imports: [
        SharedModule,
        PreJogoRoutingModule,
        NgbNavModule,
        NgbCarouselModule
    ],
    declarations: [
        PreJogoWrapperComponent,
        PreJogoListagemComponent,
        PreJogoVisualizacaoComponent,
        BannersComponent
    ],
    providers: [
        JogoService,
        BilheteEsportivoService,
        ApostaEsportivaService
    ]
})
export class PreJogoModule { }
