import { NgModule } from '@angular/core';
import { TranslateModule} from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddBankAccountRoutingModule } from './add-bank-account-routing.module';
import { AddBankAccountComponent } from './add-bank-account.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [SharedModule, AddBankAccountRoutingModule, TranslateModule],
    declarations: [AddBankAccountComponent],
    providers: [NgbActiveModal]

})
export class AddBankAccountModule { }
