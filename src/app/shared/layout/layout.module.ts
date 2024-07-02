import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {
    AcumuladaoLayoutComponent,
    AuthLayoutComponent,
    CassinoLayoutComponent,
    CassinoLiveLayoutComponent,
    DesafioLayoutComponent,
    EmptyLayoutComponent,
    LoteriaLayoutComponent,
    MainLayoutComponent,
    PagesLayoutComponent,
    PagesNoNavLayoutComponent,
    SportLayoutComponent,
    VirtuaisLayoutComponent,
    LiveSportLayoutComponent
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
import { IndiqueGanheService } from '../services/clientes/indique-ganhe.service';
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
    TabelaModalComponent,
    CarregamentoModalComponent,
    CompatilhamentoBilheteModal,
    RegrasBonusModalComponent,
    JogosLiberadosBonusModalComponent,
    CanceledBonusConfirmComponent
} from './modals';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {NgxMaskModule} from 'ngx-mask';
import {NgbAlertModule, NgbCarouselModule, NgbDropdownModule, NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuFooterComponent} from './menu-footer/menu-footer.component';
import {BilheteEsportivoComponent} from '../../esportes/bilhete/bilhete-esportivo.component';
import {SubmenuComponent} from './submenu/submenu.component';
import {SidebarMenuComponent, SidebarNavComponent} from '../sidebar';

import {NgxCurrencyModule} from 'ngx-currency';
import {BannersComponent} from './banners/banners.component';
import {ResultadosModalComponent} from './modals/resultados-modal/resultados-modal.component';
import {CodeInputModule} from 'angular-code-input';
import {NgHcaptchaModule} from 'ng-hcaptcha';
import {TranslateModule} from '@ngx-translate/core';
import {DesafiosBilheteComponent} from '../../desafios/desafios-bilhete/desafios-bilhete.component';
import {ValidarEmailModalComponent} from './modals/validar-email-modal/validar-email-modal.component';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { InformativoModalComponent } from './modals/informativo-modal/informativo-modal.component';
import { JogoService } from '../services/aposta-esportiva/jogo.service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SkeletonModule } from './skeleton/skeleton.module';
import { BlockPeerAttempsModalComponent } from './modals/block-peer-attemps-modal/block-peer-attemps-modal.component';
import { MultifactorConfirmationModalComponent } from './modals/multifactor-confirmation-modal/multifactor-confirmation-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        GoogleSigninButtonModule,

        UtilsModule,
        AngularSvgIconModule,
        NgxMaskModule.forRoot(),
        NgxCurrencyModule,
        NgbModalModule,
        NgbAlertModule,
        NgbCarouselModule,
        NgbDropdownModule,
        NgbModule,
        CodeInputModule.forRoot({
            codeLength: 6
        }),
        NgHcaptchaModule.forRoot({
            siteKey: '47a691c3-c623-4ae4-939a-37b44e09a9e8',
            languageCode: 'pt'
        }),
        TranslateModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        SkeletonModule
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
        RegrasBonusModalComponent,
        JogosLiberadosBonusModalComponent,
        BilheteCompartilhamentoComponent,
        AtivarCartaoModalComponent,
        ApostaEncerramentoModalComponent,
        MenuFooterComponent,
        BilheteEsportivoComponent,
        SportLayoutComponent,
        PagesLayoutComponent,
        PagesNoNavLayoutComponent,
        CassinoLayoutComponent,
        CassinoLiveLayoutComponent,
        VirtuaisLayoutComponent,
        SubmenuComponent,
        LoteriaLayoutComponent,
        DesafioLayoutComponent,
        AcumuladaoLayoutComponent,
        LiveSportLayoutComponent,
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
        DesafiosBilheteComponent,
        ValidarEmailModalComponent,
        InformativoModalComponent,
        CarregamentoModalComponent,
        CompatilhamentoBilheteModal,
        WelcomePageComponent,
        CanceledBonusConfirmComponent,
        BlockPeerAttempsModalComponent,
        MultifactorConfirmationModalComponent,
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
        BannersComponent,
        WelcomePageComponent,
        SubmenuComponent,
        SkeletonModule
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
        JogoService,
        AcumuladaoService,
        IndiqueGanheService,
        {
            provide: RECAPTCHA_SETTINGS,

            useValue: { siteKey: '6LdT1I0kAAAAAEQlEiqdYeD58l1QkNT-EL1Hdiun' } as RecaptchaSettings,
        }
    ]
})
export class LayoutModule {
}
