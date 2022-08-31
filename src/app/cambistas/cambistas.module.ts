import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CambistasRoutingModule} from './cambistas-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ApuracaoComponent} from './apuracao/apuracao.component';
import {RelatorioService} from '../shared/services/relatorio.service';
import {MessageService} from '../shared/services/utils/message.service';

@NgModule({
    declarations: [
        ApuracaoComponent
    ],
    imports: [
        SharedModule,
        CambistasRoutingModule,
        NgbModule
    ],
    providers: [
        RelatorioService,
        MessageService
    ]
})
export class CambistasModule {
}
