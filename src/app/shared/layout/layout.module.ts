import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {
    MainLayoutComponent,
    EmptyLayoutComponent,
    AuthLayoutComponent,
    SportLayoutComponent,
    PagesLayoutComponent,
    LoteriaLayoutComponent,
    DesafioLayoutComponent,
    AcumuladaoLayoutComponent
} from './app-layouts';
import {HeaderComponent} from './header/header.component';
import {NavigationComponent} from './navigation/navigation.component';
import {FooterComponent} from './footer/footer.component';
import {ErrorMsgComponent} from './error-msg/error-msg.component';
import {ExibirBilheteDesafioComponent} from './exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import {ExibirBilheteEsportivoComponent} from './exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import {ExibirBilheteLoteriaComponent} from './exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import {BilheteAcumuladaoComponent} from './exibir-bilhete/acumuladao/bilhete-acumuladao.component';
import {BilheteCompartilhamentoComponent} from './bilhete-compartilhamento/bilhete-compartilhamento.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {UtilsModule} from '../utils/utils.module';
import {ApostaService, ApostaEsportivaService, CartaoService, RegioesDestaqueService} from '../../services';
import {
    PesquisaModalComponent, TabelaModalComponent,
    ApostaModalComponent, PreApostaModalComponent,
    ConfirmModalComponent, PesquisarApostaModalComponent,
    CartaoCadastroModalComponent, CartaoModalComponent,
    PesquisarCartaoModalComponent, SolicitarSaqueModalComponent,
    RecargaCartaoModalComponent, RecargaSuccessModalComponent,
    AtivarCartaoModalComponent, ApostaEncerramentoModalComponent
} from './modals';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {NgxMaskModule} from 'ngx-mask';
import {NgbAlertModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuFooterComponent} from './menu-footer/menu-footer.component';
import {BilheteEsportivoComponent} from '../../esportes/bilhete/bilhete-esportivo.component';
import {SubmenuComponent} from './submenu/submenu.component';
import {SidebarNavComponent} from './sidebar-nav/sidebar-nav.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        UtilsModule,
        AngularSvgIconModule,
        NgxMaskModule.forRoot(),
        NgbModalModule,
        NgbAlertModule
    ],
    declarations: [
        MainLayoutComponent,
        EmptyLayoutComponent,
        AuthLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent,
        ExibirBilheteDesafioComponent,
        ExibirBilheteEsportivoComponent,
        ExibirBilheteLoteriaComponent,
        BilheteAcumuladaoComponent,
        SpinnerComponent,
        PesquisaModalComponent,
        TabelaModalComponent,
        ApostaModalComponent,
        PreApostaModalComponent,
        ConfirmModalComponent,
        PesquisarApostaModalComponent,
        CartaoCadastroModalComponent,
        CartaoModalComponent,
        PesquisarCartaoModalComponent,
        SolicitarSaqueModalComponent,
        RecargaCartaoModalComponent,
        RecargaSuccessModalComponent,
        BilheteCompartilhamentoComponent,
        AtivarCartaoModalComponent,
        ApostaEncerramentoModalComponent,
        MenuFooterComponent,
        BilheteEsportivoComponent,
        SportLayoutComponent,
        PagesLayoutComponent,
        SubmenuComponent,
        LoteriaLayoutComponent,
        DesafioLayoutComponent,
        AcumuladaoLayoutComponent,
        SidebarNavComponent
    ],
    exports: [
        MainLayoutComponent,
        AuthLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent,
        ExibirBilheteDesafioComponent,
        ExibirBilheteEsportivoComponent,
        ExibirBilheteLoteriaComponent,
        BilheteAcumuladaoComponent,
        SpinnerComponent,
        BilheteEsportivoComponent
    ],
    providers: [
        ApostaEsportivaService,
        ApostaService,
        CartaoService,
        RegioesDestaqueService
    ]
})
export class LayoutModule {
}
