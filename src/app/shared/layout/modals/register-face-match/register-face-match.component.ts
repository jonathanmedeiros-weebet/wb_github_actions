import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { skip } from 'rxjs/operators';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
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
  selector: 'app-register-face-match',
  templateUrl: './register-face-match.component.html',
  styleUrls: ['./register-face-match.component.css']
})
export class RegisterFaceMatchComponent implements OnInit, AfterViewInit {
  verifiedIdentity = null;
  legitimuzToken = '';
  faceMatchEnabled = true;
  faceMatchType = null;
  docCheckToken = "";
  secretHash = ""
  dataUserCPF = ''
  @Input() user;
  @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
  @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

  constructor(
    public faceMatchService: FaceMatchService,
    public clientService: ClienteService,
    public legitimuzService: LegitimuzService,
    public messageService: MessageService,
    public translate: TranslateService,
    public paramLocais: ParametrosLocaisService,
    public activeModal: NgbActiveModal,
    private docCheckService: DocCheckService,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.faceMatchType = this.paramLocais.getOpcoes().faceMatchType;
    this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;

    switch (this.faceMatchType) {
      case 'legitimuz':
        this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;
        this.faceMatchEnabled = Boolean(this.paramLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramLocais.getOpcoes().faceMatchRegister);
        break;
      case 'docCheck':
        this.docCheckToken = this.paramLocais.getOpcoes().dockCheck_token;
        this.faceMatchEnabled = Boolean(this.paramLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramLocais.getOpcoes().faceMatchRegister);
        this.docCheckService.iframeMessage$.subscribe(message => {
          if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
            this.faceMatchService.updadeFacematch({ document: this.user.cpf, register: true }).subscribe()
            this.messageService.success(this.translate.instant('face_match.verified_identity'));
            this.activeModal.close('success');
          } else {
            this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
            this.activeModal.dismiss('error');
          }
        })
        break;
      default:
        break;
    }

    this.dataUserCPF = String(this.user.cpf).replace(/[.\-]/g, '');
    this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF, this.paramLocais.getOpcoes().dockCheck_secret_hash);
    this.cd.detectChanges(); 
    this.legitimuzService.curCustomerIsVerified
      .pipe(skip(1))
      .subscribe(curCustomerIsVerified => {
        this.verifiedIdentity = curCustomerIsVerified;
        if (this.verifiedIdentity) {
          this.faceMatchService.updadeFacematch({ document: this.user.cpf, register: true }).subscribe({
            next: () => {
              this.legitimuzService.closeModal();
              this.messageService.success(this.translate.instant('face_match.verified_identity'));
              this.activeModal.close('success');
            }, error: () => {
              this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
              this.activeModal.dismiss('error');
            }
          })
        }
      });
  }

  ngAfterViewInit() {
    if (this.faceMatchEnabled) {
      if (this.faceMatchType == 'legitimuz') {
        this.legitimuzService.init();
        this.legitimuzService.mount();
        this.legitimuz.changes
          .subscribe(() => {
            this.legitimuzService.init();
            this.legitimuzService.mount();
          });
      } else {
        this.docCheckService.init();
        this.docCheck.changes
          .subscribe(() => {
            this.docCheckService.init();
          });
      }
    }
  }
}
