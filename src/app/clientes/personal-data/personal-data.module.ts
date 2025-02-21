import { NgModule } from '@angular/core';

import { EmailComponent } from './email/email.component';
import { PhoneComponent } from './phone/phone.component';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { PersonalDataRoutingModule } from './personal-data-routing.module';
import { PersonalDataComponent } from './personal-data.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        PersonalDataComponent,
        EmailComponent,
        PhoneComponent,
        AddressComponent,
        DocumentComponent
    ],
    imports: [
        PersonalDataRoutingModule,
        SharedModule
    ],
})
export class PersonalDataModule { }
