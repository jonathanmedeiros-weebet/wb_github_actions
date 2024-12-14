import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';

@Component({
  selector: 'app-face-match-modal',
  templateUrl: './face-match-modal.component.html',
  styleUrls: ['./face-match-modal.component.css']
})
export class FaceMatchModalComponent implements OnInit, AfterViewInit {
  @Input() user;
  verifiedIdentity = null;
  legitimuzToken = '';
  @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;

  constructor(
    public faceMatchService: FaceMatchService,
    public clientService: ClienteService,
    public legitimuzService: LegitimuzService,
    public messageService: MessageService,
    public translate: TranslateService,
    public paramLocais: ParametrosLocaisService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.activeModal.close('success');

    this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;

    this.clientService.getFaceMatchClient(this.user.id).subscribe((customer) => {
      this.user.cpf = customer.cpf;
      this.legitimuzService.init();
      this.legitimuzService.mount();
    }, (err) => {
      console.error(err);
    });


    this.legitimuzService.curCustomerIsVerified
      .subscribe(curCustomerIsVerified => {
        console.log(curCustomerIsVerified);
        this.verifiedIdentity = curCustomerIsVerified;
        if (this.verifiedIdentity) {
          this.faceMatchService.updadeFacematch({
            document: this.user.cpf,
            // NOVACOLUNA: true
          }).subscribe({
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

  ngAfterViewInit(): void {
    // this.legitimuz.changes
    //   .subscribe(() => {
    //     this.legitimuzService.init();
    //     this.legitimuzService.mount();
    //   });
  }

  updateFaceMatch() {
  }
}
