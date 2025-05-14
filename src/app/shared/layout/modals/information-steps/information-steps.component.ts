import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconAssuredWorkloadComponent } from '../../icons/icon-assured-workload.component';
import { IconVerifiedUserComponent } from '../../icons/icon-verified-user.component';
import { TranslateService } from '@ngx-translate/core';
import { IconMailComponent } from '../../icons/icon-mail.component';
import { IconSignalPhoneComponent } from '../../icons/icon-signal-phone.component';
import { AccountVerificationTypes } from 'src/app/shared/enums';

const RULES_TYPE = 'rules';

@Component({
  selector: 'app-information-steps',
  templateUrl: './information-steps.component.html',
  styleUrl: './information-steps.component.scss'
})
export class InformationStepsComponent implements OnInit {
  @Input() informationType: AccountVerificationTypes | string = RULES_TYPE;

  public informations = [];
  public textButton: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
  ) { }

  get hasButton(): boolean {
    if (this.informationType === AccountVerificationTypes.EMAIL || this.informationType === AccountVerificationTypes.PHONE) {
      return true;
    }
    return false;
  }

  get title(): string {
    if (this.informationType === RULES_TYPE) {
      return this.translate.instant('accountVerification.playngByTheRules');
    } else if (this.informationType === AccountVerificationTypes.EMAIL || this.informationType === AccountVerificationTypes.PHONE) {
      return this.translate.instant('accountVerification.problemsWithCode');
    } else {
      return '';
    }
  }

  ngOnInit() {
    switch (this.informationType) {
      case RULES_TYPE:
        this.informations = [
          { description: this.translate.instant('accountVerification.checkingLegistation'), icon: IconAssuredWorkloadComponent, iconProps: { size: '20px' } },
          { description: this.translate.instant('accountVerification.securePlataform'), icon: IconVerifiedUserComponent, iconProps: { size: '20px' } }
        ];
        break;
      case AccountVerificationTypes.PHONE:
        this.textButton = this.translate.instant('botoes.talkToSupport');
        this.informations = [
          { description: this.translate.instant('accountVerification.checkPhoneSignal'), icon: IconSignalPhoneComponent, iconProps: { size: '20px' } },
          { description: this.translate.instant('accountVerification.checkPhoneNumberRegistered'), icon: IconVerifiedUserComponent, iconProps: { size: '20px' } }
        ];
        break;
      case AccountVerificationTypes.EMAIL:
        this.textButton = this.translate.instant('botoes.talkToSupport');
        this.informations = [
          { description: this.translate.instant('accountVerification.checkSpam'), icon: IconMailComponent, iconProps: { size: '20px' } },
          { description: this.translate.instant('accountVerification.checkEmailRegistered'), icon: IconVerifiedUserComponent, iconProps: { size: '20px' } }
        ];
        break;
      default:
        break;
    }
  }

  public handleClick() {
    this.activeModal.close('cancel');
  }

  public handleClose() {
    this.activeModal.close('cancel');
  }
}
