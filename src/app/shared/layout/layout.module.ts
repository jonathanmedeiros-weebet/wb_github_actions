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
    LiveSportLayoutComponent,
    RifaLayoutComponent,
    BetbyLayoutComponent
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
    CanceledBonusConfirmComponent,
    ValidatePhoneModalComponent
} from './modals';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {NgxMaskModule} from 'ngx-mask';
import {NgbAlertModule, NgbCarouselModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuFooterComponent} from './menu-footer/menu-footer.component';
import {BilheteEsportivoComponent} from '../../esportes/bilhete/bilhete-esportivo.component';
import {BilheteRifaComponent} from '../../rifas/bilhete/bilhete-rifa.component';
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
import { ExibirBilheteRifaComponent } from './exibir-bilhete/rifa/exibir-bilhete-rifa/exibir-bilhete-rifa.component';
import { FreeSpinService } from '../services/clientes/free-spin.service';
import { CashbackService } from '../services/clientes/cashback.service';
import { PasswordExpiredModalComponent } from './modals/password-expired-modal/password-expired-modal.component';
import { ConfiguracaoLimitePerdasModalComponent } from './modals/configuracao-limite-perdas-modal/configuracao-limite-perdas-modal.component';
import { BackPageComponent } from './back-page/back-page/back-page.component';
import { FaceMatchModalComponent } from './modals/face-match-modal/face-match-modal/face-match-modal.component';
import { AddBankAccountModalComponent } from './modals/add-bank-account-modal/add-bank-account-modal.component';
import { ListBankAccountsComponent } from './list-bank-accounts/list-bank-accounts.component';
import { LastAccessesModalComponent } from './modals/last-accesses-modal/last-accesses-modal.component';
import { WeePaginationModule } from 'src/app/weebet-pagination/wee-pagination.module';

import { ExibirBilheteCassinoComponent } from './exibir-bilhete/cassino/exibir-bilhete-cassino/exibir-bilhete-cassino.component';
import { RegisterModalComponentComponent } from './modals/register-modal/register-modal-component/register-modal-component.component';
import { AddressDataComponent } from './modals/register-modal/parts/address-data/address-data.component';
import { LoginDataComponent } from './modals/register-modal/parts/login-data/login-data.component';
import { NavigationBarComponent } from './modals/register-modal/parts/navigation-bar/navigation-bar.component';
import { OnboardingModalComponent } from './modals/onboarding-modal/onboarding-modal.component';
import { StepperProgressBarComponent } from './modals/register-modal/parts/stepper-progress-bar/stepper-progress-bar.component';
import { PersonalDataComponent } from './modals/register-modal/parts/personal-data/personal-data.component';
import { RegisterFaceMatchComponent } from './modals/register-face-match/register-face-match.component';
import { RegisterV3ModalComponent } from './modals/register-v3-modal/register-v3-modal.component';
import { AccountVerifiedSuccessComponent } from './modals/account-verified-success/account-verified-success.component';
import { VerifyEmailOrPhoneComponent } from './modals/verify-email-or-phone/verify-email-or-phone.component';
import { CardVerificationPendingComponent } from './header/parts/card-verification-pending/card-verification-pending.component';
import { AccountVerificationAlertComponent } from './modals/account-verification-alert/account-verification-alert.component';
import { BetSharingModalComponent } from './modals/bet-sharing-modal/bet-sharing-modal.component';
import { TermsAcceptedComponent } from './modals/terms-accepted/terms-accepted.component';

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
            siteKey: '30aaf7ea-dc50-41d4-8866-d15e08ee3492',
            languageCode: 'pt'
        }),
        TranslateModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        SkeletonModule,
        WeePaginationModule,
        NgbTooltipModule
    ],
    declarations: [
        MainLayoutComponent,
        BetbyLayoutComponent,
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
        BilheteRifaComponent,
        SportLayoutComponent,
        PagesLayoutComponent,
        PagesNoNavLayoutComponent,
        CassinoLayoutComponent,
        CassinoLiveLayoutComponent,
        VirtuaisLayoutComponent,
        SubmenuComponent,
        LoteriaLayoutComponent,
        RifaLayoutComponent,
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
        ExibirBilheteRifaComponent,
        PasswordExpiredModalComponent,
        ConfiguracaoLimitePerdasModalComponent,
        BackPageComponent,
        ExibirBilheteCassinoComponent,
        FaceMatchModalComponent,
        ValidatePhoneModalComponent,
        AddBankAccountModalComponent,
        ListBankAccountsComponent,
        LastAccessesModalComponent,
        RegisterModalComponentComponent,
        AddressDataComponent,
        LoginDataComponent,
        PersonalDataComponent,
        NavigationBarComponent,
        OnboardingModalComponent,
        StepperProgressBarComponent,
        RegisterFaceMatchComponent,
        RegisterV3ModalComponent,
        AccountVerifiedSuccessComponent,
        VerifyEmailOrPhoneComponent,
        CardVerificationPendingComponent,
        AccountVerificationAlertComponent,
        BetSharingModalComponent,
        TermsAcceptedComponent
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
        ExibirBilheteRifaComponent,
        BilheteAcumuladaoComponent,
        SpinnerComponent,
        BilheteEsportivoComponent,
        BilheteRifaComponent,
        BannersComponent,
        WelcomePageComponent,
        SubmenuComponent,
        SkeletonModule,
        MenuFooterComponent,
        BackPageComponent,
        ValidatePhoneModalComponent,
        ListBankAccountsComponent,
        ExibirBilheteCassinoComponent
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
        CashbackService,
        FreeSpinService,
        {
            provide: RECAPTCHA_SETTINGS,

            useValue: { siteKey: '6LdT1I0kAAAAAEQlEiqdYeD58l1QkNT-EL1Hdiun' } as RecaptchaSettings,
        }
    ]
})
export class LayoutModule {
}
