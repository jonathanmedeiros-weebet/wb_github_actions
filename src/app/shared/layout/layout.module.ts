import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {
    AcumuladaoLayoutComponent,
    AuthLayoutComponent,
    CassinoLayoutComponent,
    DesafioLayoutComponent,
    EmptyLayoutComponent,
    LoteriaLayoutComponent,
    MainLayoutComponent,
    PagesLayoutComponent,
    PagesNoNavLayoutComponent,
    SportLayoutComponent,
    VirtuaisLayoutComponent
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
import {
    AcumuladaoService,
    ApostaEsportivaService,
    ApostaLoteriaService,
    ApostaService,
    CartaoService,
    DesafioApostaService,
    RelatorioService,
    SorteioService
} from '../../services';
import {
    ApostaEncerramentoModalComponent,
    ApostaModalComponent,
    AtivarCartaoModalComponent,
    AuthDoisFatoresModalComponent,
    CadastroModalComponent,
    CartaoCadastroModalComponent,
    CartaoModalComponent,
    ClienteApostasModalComponent,
    ClientePerfilModalComponent,
    ClientePixModalComponent,
    ClienteSenhaModalComponent,
    ConfirmModalComponent,
    EsqueceuSenhaModalComponent,
    LoginModalComponent,
    PesquisaModalComponent,
    PesquisarApostaModalComponent,
    PesquisarCartaoMobileModalComponent,
    PesquisarCartaoModalComponent,
    PreApostaModalComponent,
    RecargaCartaoModalComponent,
    RecargaSuccessModalComponent,
    SolicitarSaqueModalComponent,
    TabelaModalComponent
} from './modals';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {NgxMaskModule} from 'ngx-mask';
import {NgbAlertModule, NgbCarouselModule, NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuFooterComponent} from './menu-footer/menu-footer.component';
import {BilheteEsportivoComponent} from '../../esportes/bilhete/bilhete-esportivo.component';
import {SubmenuComponent} from './submenu/submenu.component';
import {SidebarMenuComponent, SidebarNavComponent} from '../sidebar';

import {NgxCurrencyModule} from 'ngx-currency';
import {BannersComponent} from './banners/banners.component';
import {ResultadosModalComponent} from './modals/resultados-modal/resultados-modal.component';
import {CodeInputModule} from 'angular-code-input';
import {NgHcaptchaModule} from 'ng-hcaptcha';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        UtilsModule,
        AngularSvgIconModule,
        NgxMaskModule.forRoot(),
        NgxCurrencyModule,
        NgbModalModule,
        NgbAlertModule,
        NgbCarouselModule,
        NgbModule,
        CodeInputModule.forRoot({
            codeLength: 6
        }),
        NgHcaptchaModule.forRoot({
            siteKey: '47a691c3-c623-4ae4-939a-37b44e09a9e8',
            languageCode: 'pt'
        })
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
        PagesNoNavLayoutComponent,
        CassinoLayoutComponent,
        VirtuaisLayoutComponent,
        SubmenuComponent,
        LoteriaLayoutComponent,
        DesafioLayoutComponent,
        AcumuladaoLayoutComponent,
        SidebarNavComponent,
        SidebarMenuComponent,
        LoginModalComponent,
        EsqueceuSenhaModalComponent,
        CadastroModalComponent,
        ResultadosModalComponent,
        BannersComponent,
        AuthDoisFatoresModalComponent,
        PesquisarCartaoMobileModalComponent,
        ClientePerfilModalComponent,
        ClientePixModalComponent,
        ClienteSenhaModalComponent,
        ClienteApostasModalComponent,
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
        BilheteEsportivoComponent,
        BannersComponent
    ],
    providers: [
        ApostaEsportivaService,
        ApostaService,
        CartaoService,
        SorteioService,
        DesafioApostaService,
        ApostaService,
        ApostaLoteriaService,
        ApostaEsportivaService,
        RelatorioService,
        AcumuladaoService
    ]
})
export class LayoutModule {
}
