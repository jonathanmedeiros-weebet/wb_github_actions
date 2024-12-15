import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { BankAccountsComponent } from './bank-accounts.component';
import {TranslateModule} from '@ngx-translate/core';
import { BankAccountsRoutingModule } from './bank-accounts-routing.module';

@NgModule({
    imports: [SharedModule, BankAccountsRoutingModule, TranslateModule],
    declarations: [BankAccountsComponent],
    providers: []
})
export class BankAccountsModule { }
