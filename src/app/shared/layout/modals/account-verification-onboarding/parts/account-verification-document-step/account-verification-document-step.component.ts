import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';
import { Router } from '@angular/router';

declare global {
  interface Window {
    ex_partner: any;
    exDocCheck: any;
    exDocCheckAction: any;
  }
}

const USER = JSON.parse(localStorage.getItem('user'));

@Component({
  selector: 'app-account-verification-document-step',
  templateUrl: './account-verification-document-step.component.html',
  styleUrl: './account-verification-document-step.component.scss'
})
export class AccountVerificationDocumentStepComponent {

  @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
  @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

  private unsub$: Subject<any> = new Subject();

  verifiedIdentity = null;
  legitimuzToken = '';
  faceMatchEnabled = false;
  faceMatchType = null;
  docCheckToken = "";
  secretHash = "";
  dataUserCPF = "";

  constructor(
    public faceMatchService: FaceMatchService,
    public clientService: ClienteService,
    public legitimuzService: LegitimuzService,
    public messageService: MessageService,
    public translate: TranslateService,
    public paramLocais: ParametrosLocaisService,
    public activeModal: NgbActiveModal,
    private docCheckService: DocCheckService,
    @Inject(DOCUMENT) private document: any,
    private cd: ChangeDetectorRef,
    private router: Router

  ) { }
  
  ngOnInit() {
    this.faceMatchType = this.paramLocais.getOpcoes().faceMatchType;
    localStorage.setItem('permissionWelcomePage', JSON.stringify(true));
    this.faceMatchEnabled = Boolean(this.paramLocais.getOpcoes().faceMatch && this.paramLocais.getOpcoes().faceMatchRegister);

    this.getUserData();

    switch (this.faceMatchType) {
      case 'legitimuz':
        this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;
        this.faceMatchEnabled = Boolean(this.faceMatchEnabled && this.legitimuzToken)
        break;
      case 'docCheck':
        this.docCheckService.init();
        this.docCheckToken = this.paramLocais.getOpcoes().dockCheck_token;
        this.faceMatchEnabled = Boolean(this.faceMatchEnabled && this.docCheckToken)
        this.docCheckService.iframeMessage$.pipe(takeUntil(this.unsub$)).subscribe(message => {
          if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
            this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, register: true }).subscribe(takeUntil(this.unsub$))
            this.docCheckService.closeModal();
            this.router.navigate(['/welcome']);
          }
        })
        break;
      default:
        break;
    }

    if (this.faceMatchEnabled && this.faceMatchType == 'legitimuz') {
      this.legitimuzService.curCustomerIsVerified
        .pipe(takeUntil(this.unsub$))
        .subscribe(curCustomerIsVerified => {
          if (curCustomerIsVerified == null) return;
          this.verifiedIdentity = curCustomerIsVerified;
          this.cd.detectChanges();
          if (this.verifiedIdentity) {
            this.legitimuzService.closeModal();
            this.messageService.success(this.translate.instant('face_match.verified_identity'));
            this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, register: true }).subscribe(takeUntil(this.unsub$));
            this.router.navigate(['/welcome']);
          } else {
            this.legitimuzService.closeModal();
            this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
          }
        });
    }
  }

  async getUserData() {
    const dataUser = await this.clientService.getCliente(USER.id).toPromise();
    this.dataUserCPF = String(dataUser.cpf.replace(/[.\-]/g, ''));
    this.cd.detectChanges();
    switch (this.faceMatchType) {
      case 'legitimuz':
        this.legitimuzService.init();
        this.legitimuzService.mount();
        this.document.getElementById('legitimuz-action-verify').click();
        break;
      case 'docCheck':
        this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF.replace(/[.\-]/g, ''), this.paramLocais.getOpcoes().dockCheck_secret_hash);
        this.cd.detectChanges();
        this.docCheckService.init();
        this.document.getElementById('exDocCheckAction').click();
        break;
    }
  }

  handleError(error: string) {
    this.messageService.error(error);
    this.activeModal.close('close');
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
}

