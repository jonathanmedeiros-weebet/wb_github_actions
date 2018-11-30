import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './app-layouts/main-layout.component';
import { EmptyLayoutComponent } from './app-layouts/empty-layout.component';
import { AuthLayoutComponent } from './app-layouts/auth-layout.component';
import { AdminLayoutComponent } from './app-layouts/admin-layout.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { UtilsModule } from './../utils/utils.module';
import { ApostaEsportivaService } from '../../services';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        UtilsModule
    ],
    declarations: [
        MainLayoutComponent,
        EmptyLayoutComponent,
        AuthLayoutComponent,
        AdminLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent
    ],
    exports: [
        MainLayoutComponent,
        AuthLayoutComponent,
        AdminLayoutComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        ErrorMsgComponent
    ],
    providers: [ApostaEsportivaService]
})
export class LayoutModule { }
