import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilPixComponent } from './perfil-pix.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfilPixRoutingModule } from './perfil-pix-routing.module';



@NgModule({
    declarations: [
        PerfilPixComponent
    ],
    imports: [
        CommonModule,
        PerfilPixRoutingModule,
        SharedModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgbModule
    ],
    providers: [provideNgxMask()]
})
export class PerfilPixModule { }
