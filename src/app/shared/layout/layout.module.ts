import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './app-layouts/main-layout.component';
import { EmptyLayoutComponent } from './app-layouts/empty-layout.component';
import { AuthLayoutComponent } from './app-layouts/auth-layout.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { ExibirBilheteDesafioComponent } from './exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import { ExibirBilheteEsportivoComponent } from './exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { ExibirBilheteLoteriaComponent } from './exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { BilheteAcumuladaoComponent } from './exibir-bilhete/acumuladao/bilhete-acumuladao.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { UtilsModule } from './../utils/utils.module';
import { ApostaService, ApostaEsportivaService, CartaoService } from '../../services';
import {
    PesquisaModalComponent, TabelaModalComponent,
    ApostaModalComponent, PreApostaModalComponent,
    ConfirmModalComponent, PesquisarApostaModalComponent,
    CartaoCadastroModalComponent, CartaoModalComponent,
    PesquisarCartaoModalComponent, SolicitarSaqueModalComponent,
    RecargaCartaoModalComponent, RecargaSuccessModalComponent

} from './modals';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        UtilsModule,
        AngularSvgIconModule,
        NgxMaskModule.forRoot(),
        NgbModalModule
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
        RecargaSuccessModalComponent
    ],
    entryComponents: [
        PesquisaModalComponent,
        PesquisarApostaModalComponent,
        TabelaModalComponent,
        ApostaModalComponent,
        PreApostaModalComponent,
        ConfirmModalComponent,
        CartaoCadastroModalComponent,
        CartaoModalComponent,
        PesquisarCartaoModalComponent,
        SolicitarSaqueModalComponent,
        RecargaCartaoModalComponent,
        RecargaSuccessModalComponent
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
        SpinnerComponent
    ],
    providers: [
        ApostaEsportivaService,
        ApostaService,
        CartaoService
    ]
})
export class LayoutModule { }
