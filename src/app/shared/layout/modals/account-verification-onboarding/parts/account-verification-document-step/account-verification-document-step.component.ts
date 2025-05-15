import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AccountVerificationService, ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';

declare global {
  interface Window {
    ex_partner: any;
    exDocCheck: any;
    exDocCheckAction: any;
  }
}

@Component({
  selector: 'app-account-verification-document-step',
  templateUrl: './account-verification-document-step.component.html',
  styleUrl: './account-verification-document-step.component.scss'
})
export class AccountVerificationDocumentStepComponent {

  @Output() onAdvance = new EventEmitter();

  private unsub$: Subject<any> = new Subject();

  private faceMatchEnabled: boolean = false;
  private faceMatchVerified: boolean = false;
  private faceMatchType: string = "";
  public secretHash: string = "";
  public dataUserCPF: string = "";
  public showFaceMatchLegitimuz: boolean = false;
  public showFaceMatchDocCheck: boolean = false;

  constructor(
    private faceMatchService: FaceMatchService,
    private clientService: ClienteService,
    private legitimuzService: LegitimuzService,
    private messageService: MessageService,
    private translate: TranslateService,
    private paramLocais: ParametrosLocaisService,
    public activeModal: NgbActiveModal,
    private docCheckService: DocCheckService,
    @Inject(DOCUMENT) private document: any,
    private cd: ChangeDetectorRef,
    private accountVerificationService: AccountVerificationService
  ) { }
  
  async ngOnInit() {
    this.faceMatchType = this.paramLocais.getOpcoes().faceMatchType;
    this.faceMatchEnabled = Boolean(this.paramLocais.getOpcoes().faceMatch && this.paramLocais.getOpcoes().faceMatchRegister);
    await this.getUserData();
    this.cd.detectChanges();
    this.inicializeFaceMatch();
  }

  async getUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dataUser = await this.clientService.getCliente(user.id).toPromise();
    this.dataUserCPF = String(dataUser.cpf.replace(/[.\-]/g, ''));
  }

  inicializeFaceMatch() {
    switch (this.faceMatchType) {
      case 'legitimuz':
        this.showFaceMatchLegitimuz = Boolean(this.faceMatchEnabled && this.paramLocais.getOpcoes().legitimuz_token);
        this.cd.detectChanges();
        this.legitimuzService.init();
        this.legitimuzService.mount();
        this.document.getElementById('legitimuz-action-verify').click();
        this.legitimuzService.curCustomerIsVerified
          .pipe(takeUntil(this.unsub$))
          .subscribe(curCustomerIsVerified => {
            if (curCustomerIsVerified == null || this.faceMatchVerified) {
              return;
            }
            
            if (curCustomerIsVerified) {
              this.faceMatchVerified = true;
              this.succesValidation();
            } else {
              this.legitimuzService.closeModal();
              this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
            }
          });
        break;
      case 'docCheck':
        this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF.replace(/[.\-]/g, ''), this.paramLocais.getOpcoes().dockCheck_secret_hash);
        this.faceMatchEnabled = Boolean(this.faceMatchEnabled && this.paramLocais.getOpcoes().dockCheck_token);
        this.showFaceMatchDocCheck = true;
        this.cd.detectChanges();
        this.docCheckService.init();
        this.document.getElementById('exDocCheckAction').click();
        this.docCheckService.iframeMessage$.pipe(takeUntil(this.unsub$)).subscribe(message => {
          if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
            this.succesValidation();
          }
        });
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

  async succesValidation() {  
    this.messageService.success(this.translate.instant('face_match.verified_identity'));
    await this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, register: true }).toPromise();
    this.accountVerificationService.getAccountVerificationDetail().toPromise();
    
    this.onAdvance.emit();

    switch (this.faceMatchType) {
      case 'legitimuz':
        this.legitimuzService.closeModal();
        break;
      case 'docCheck':
        this.docCheckService.closeModal();
        break;
    }
  }
}