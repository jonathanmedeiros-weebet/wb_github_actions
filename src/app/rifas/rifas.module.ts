import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RifasRoutingModule } from './rifas-routing.module';
import { WallComponent } from './wall/wall.component';
import { ViewComponent } from './view/view.component';
import {SharedModule} from '../shared/shared.module';
import { CountdownComponent } from './countdown/countdown.component';
import { FormComponent } from './form/form.component';



@NgModule({
    declarations: [
        WallComponent,
        ViewComponent,
        CountdownComponent,
        FormComponent

    ],
    imports: [
        SharedModule,
        CommonModule,
        RifasRoutingModule
    ]
})
export class RifasModule { }
