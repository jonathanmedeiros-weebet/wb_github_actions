import { NgModule } from '@angular/core';

import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { PersonalDataRoutingModule } from './personal-data-routing.module';
import { PersonalDataComponent } from './personal-data.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { TermsComponent } from './terms/terms.component';

@NgModule({
    declarations: [
        PersonalDataComponent,
        EmailComponent,
        PhoneComponent,
        AddressComponent,
        DocumentComponent,
        TermsComponent
    ],
    imports: [
        PersonalDataRoutingModule,
        SharedModule,
        NgxMaskModule.forRoot()
    ],
})
export class PersonalDataModule { }
