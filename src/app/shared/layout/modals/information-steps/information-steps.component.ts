import { AfterViewInit, Component, Input, QueryList, Type, ViewChildren, ViewContainerRef, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IconAssuredWorkloadComponent } from '../../icons/icon-assured-workload';
import { IconVerifiedUserComponent } from '../../icons/icon-verified-user';
import { TranslateService } from '@ngx-translate/core';
import { IconMailComponent } from '../../icons/icon-mail';
import { IconSignalPhoneComponent } from '../../icons/icon-signal-phone';
import { VerificationTypes } from 'src/app/shared/enums';

const RULES = 'rules';

@Component({
  selector: 'app-information-steps',
  templateUrl: './information-steps.component.html',
  styleUrl: './information-steps.component.scss'
})
export class InformationStepsComponent implements OnInit {
  @Input() informationType: string;

  public informations = [];
  public textButton: string = '';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
  ) { }

  get hasButton(): boolean {
    if (this.informationType === VerificationTypes.EMAIL || this.informationType === VerificationTypes.PHONE) {
      return true;
    }
    return false;
  }

  get title(): string {
    if (this.informationType === RULES) {
      return this.translate.instant('accountVerification.playngByTheRules');
    } else if (this.informationType === VerificationTypes.EMAIL || this.informationType === VerificationTypes.PHONE) {
      return this.translate.instant('accountVerification.problemsWithCode');
    } else {
      return '';
    }
  }

  ngOnInit() {
    switch (this.informationType) {
      case RULES:
        this.informations = [
          { description: this.translate.instant('accountVerification.checkingLegistation'), icon: IconAssuredWorkloadComponent, iconProps: { size: '20px' } },
          { description: this.translate.instant('accountVerification.securePlataform'), icon: IconVerifiedUserComponent, iconProps: { size: '20px' } }
        ];
        break;
      case VerificationTypes.PHONE:
        this.textButton = this.translate.instant('botoes.talkToSupport');
        this.informations = [
          { description: this.translate.instant('accountVerification.checkPhoneSignal'), icon: IconSignalPhoneComponent, iconProps: { size: '20px' } },
          { description: this.translate.instant('accountVerification.checkPhoneNumberRegistered'), icon: IconVerifiedUserComponent, iconProps: { size: '20px' } }
        ];
        break;
      case VerificationTypes.EMAIL:
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
