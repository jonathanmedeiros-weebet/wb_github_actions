import { AfterViewInit, Component, Input, QueryList, Type, ViewChildren, ViewContainerRef, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IconAssuredWorkloadComponent } from '../../../icons/icon-assured-workload';
import { IconVerifiedUserComponent } from '../../../icons/icon-verified-user';
import { TranslateService } from '@ngx-translate/core';
import { IconMailComponent } from '../../../icons/icon-mail';
import { IconSignalCelularComponent } from '../../../icons/icon-signal-celular';

@Component({
  selector: 'app-generic-information-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './information-steps.component.html',
  styleUrl: './information-steps.component.scss'
})
export class InformationStepsComponent implements OnInit {
  @Input() informationType: string;

  public informations;
  public textButton: string = undefined;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
  ) { }

  get hasButton(): boolean {
    if (this.informationType && this.informationType !== 'rules') {
      this.textButton = this.translate.instant('buttons.talkToSupport');
      return true;
    }
    return false;
  }

  get hasTitle(): string {
    if (this.informationType === 'rules')
      return this.translate.instant('accountVerification.playByTheRules');
    else {
      return this.translate.instant('accountVerification.problemsWithCode');
    }
  }

  ngOnInit() {
    if (this.informationType === 'rules') {
      this.informations = [
        { text: this.translate.instant('accountVerification.checkingLegistation'), icon: IconAssuredWorkloadComponent, iconProps:{size: '20px'}},
        { text: this.translate.instant('accountVerification.security'), icon: IconVerifiedUserComponent,iconProps:{size: '20px'}}
      ];
    } else if (this.informationType === 'phone') {
      this.informations = [
        { text: this.translate.instant('accountVerification.checkPhoneSignal'), icon: IconSignalCelularComponent, iconProps:{size: '20px'}},
        { text: this.translate.instant('accountVerification.checkPhoneNumberRegistered'), icon: IconVerifiedUserComponent, iconProps:{size: '20px'}}
      ];
    } else if (this.informationType === 'mail') {
      this.informations = [
        { text: this.translate.instant('accountVerification.checkSpam'), icon: IconMailComponent, iconProps:{size: '20px'}},
        { text: this.translate.instant('accountVerification.checkEmailRegistered'), icon: IconVerifiedUserComponent, iconProps:{size: '20px'}}
      ];
    }
  }
}
