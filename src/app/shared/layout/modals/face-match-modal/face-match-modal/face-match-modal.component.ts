import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { skip } from 'rxjs/operators';
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
    this.legitimuzToken = this.paramLocais.getOpcoes().legitimuz_token;

    this.clientService.getFaceMatchClient(this.user.id).subscribe((customer) => {
      this.user.cpf = customer.cpf;
      this.legitimuzService.init();
      this.legitimuzService.mount();
    }, (err) => {
      console.error(err);
    });

    this.legitimuzService.curCustomerIsVerified
      .pipe(skip(1))
      .subscribe(curCustomerIsVerified => {
        console.log("customer is verified: ", curCustomerIsVerified);
        this.verifiedIdentity = curCustomerIsVerified;
        if (this.verifiedIdentity) {
          console.log("Verified identity: ", this.verifiedIdentity);
          this.faceMatchService.updadeFacematch({document: this.user.cpf, periodic_validation: true}).subscribe({
            next: () => {
              console.log("FaceMatch updated");
              this.legitimuzService.closeModal();
              this.messageService.success(this.translate.instant('face_match.verified_identity'));
              this.activeModal.close('success');
            }, error: () => {
              console.error("Error updating FaceMatch");
              this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
              this.activeModal.dismiss('error');
            }
          })
        }
      });
  }

  ngAfterViewInit(): void { }
}
