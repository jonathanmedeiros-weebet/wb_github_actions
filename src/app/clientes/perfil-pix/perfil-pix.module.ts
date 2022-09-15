import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilPixComponent } from './perfil-pix.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
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
        NgxMaskModule,
        NgbModule
    ]
})
export class PerfilPixModule { }
