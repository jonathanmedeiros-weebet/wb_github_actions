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
import { ConsultaBilheteEsportivoComponent } from './consulta-bilhete/esportes/consulta-bilhete-esportivo.component';
import { ConsultaBilheteLoteriaComponent } from './consulta-bilhete/loteria/consulta-bilhete-loteria.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { UtilsModule } from './../utils/utils.module';
import { ApostaEsportivaService } from '../../services';
import {
    PesquisaModalComponent, TabelaModalComponent, ApostaModalComponent,
    ApostaSuccessModalComponent, CancelApostaModalComponent, PesquisarApostaModalComponent,
    LoteriaSuccessModalComponent, CartaoCadastroModalComponent
} from './modals';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        UtilsModule,
        AngularSvgIconModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        MainLayoutComponent,
        EmptyLayoutComponent,
        AuthLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent,
        ConsultaBilheteEsportivoComponent,
        ConsultaBilheteLoteriaComponent,
        SpinnerComponent,
        PesquisaModalComponent,
        TabelaModalComponent,
        ApostaModalComponent,
        ApostaSuccessModalComponent,
        CancelApostaModalComponent,
        PesquisarApostaModalComponent,
        LoteriaSuccessModalComponent,
        CartaoCadastroModalComponent,
    ],
    entryComponents: [
        PesquisaModalComponent,
        PesquisarApostaModalComponent,
        TabelaModalComponent,
        ApostaModalComponent,
        ApostaSuccessModalComponent,
        CancelApostaModalComponent,
        LoteriaSuccessModalComponent,
        CartaoCadastroModalComponent
    ],
    exports: [
        MainLayoutComponent,
        AuthLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent,
        ConsultaBilheteEsportivoComponent,
        ConsultaBilheteLoteriaComponent,
        SpinnerComponent
    ],
    providers: [ApostaEsportivaService]
})
export class LayoutModule { }
