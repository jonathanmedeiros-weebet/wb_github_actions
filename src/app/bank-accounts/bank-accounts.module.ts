import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BankAccountsComponent } from './bank-accounts.component';
import { BankAccountsRoutingModule } from './bank-accounts-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [SharedModule, BankAccountsRoutingModule, TranslateModule],
    declarations: [BankAccountsComponent],
    providers: [NgbActiveModal]
})
export class BankAccountsModule {}
