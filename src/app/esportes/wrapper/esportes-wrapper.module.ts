import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { EsportesWrapperComponent } from './esportes-wrapper.component';

@NgModule({
    imports: [SharedModule],
    declarations: [EsportesWrapperComponent],
    exports: [EsportesWrapperComponent],
    providers: []
})
export class EsportesWrapperModule { }
