import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { Cliente } from 'src/app/shared/models/clientes/cliente';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzFacialService } from 'src/app/shared/services/legitimuz-facial.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
    @Input() title;
    @Input() msg;
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('legitimuzLiveness') private legitimuzLiveness: QueryList<ElementRef>;
    faceMatchEnabled = false;
    faceMatchChangePassword = false;
    faceMatchChangePasswordValidated = false;
    legitimuzToken = "";
    verifiedIdentity = null;
    disapprovedIdentity = false;
    private unsub$ = new Subject();
    showLoading = true;
    cliente: Cliente;
    faceMatchActive = false;

  constructor(
    public activeModal: NgbActiveModal,
    private legitimuzService: LegitimuzService,
    private LegitimuzFacialService: LegitimuzFacialService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private faceMatchService: FaceMatchService,
    private paramsLocais: ParametrosLocaisService,
    private messageService: MessageService,
    private clienteService: ClienteService,
  ) { }

    ngOnInit() {
        this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
        this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchAccountBankDeletion);
        if (!this.faceMatchEnabled) {
            this.faceMatchActive = true;
        }

        this.faceMatchActive = this.paramsLocais.getOpcoes().faceMatchAccountBankDeletion;

        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => {
                    this.handleError(error);
                }

            );
        
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    if (this.verifiedIdentity) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_bank_delete: true }).subscribe({
                            next: (res) => {
                                this.LegitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchActive = false;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchActive = true;
                            }
                        })
                    }
                });
            this.LegitimuzFacialService.faceIndex
            .pipe(takeUntil(this.unsub$))
            .subscribe(faceIndex => {
                if (faceIndex) {
                    this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_bank_delete: true }).subscribe({
                        next: (res) => {
                            this.LegitimuzFacialService.closeModal();
                            this.messageService.success(this.translate.instant('face_match.verified_identity'));
                            this.faceMatchActive = false;
                            this.cd.detectChanges();
                        }, error: (error) => {
                            this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                            this.faceMatchActive = true;
                        }
                    })
                }
            })
        }
    }

    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuz.changes
                .subscribe(() => {
                    this.legitimuzService.init();
                    this.legitimuzService.mount();
                });
            this.legitimuzLiveness.changes
                .subscribe(() => {
                    this.LegitimuzFacialService.init();
                    this.LegitimuzFacialService.mount();
                });
        }
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

}
