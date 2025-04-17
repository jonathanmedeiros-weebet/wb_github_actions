import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { Cliente } from 'src/app/shared/models/clientes/cliente';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';
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
    @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;

    faceMatchEnabled = false;
    legitimuzToken = "";
    verifiedIdentity = null;
    disapprovedIdentity = false;
    private unsub$ = new Subject();
    showLoading = true;
    cliente: Cliente;
    faceMatchActive = false;
    faceMatchAccountDeletion = false;
    dataUserCPF = "";
    secretHash = "";
    docCheckToken = "";
    faceMatchType = null;
   

  constructor(
    public activeModal: NgbActiveModal,
    private legitimuzService: LegitimuzService,
    private legitimuzFacialService: LegitimuzFacialService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private faceMatchService: FaceMatchService,
    private paramsLocais: ParametrosLocaisService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private docCheckService: DocCheckService
  ) { }

    ngOnInit() {
        this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe(
                res => {
                    this.cliente = res;
                    this.dataUserCPF = String(this.cliente.cpf).replace(/[.\-]/g, '');
                    if(this.faceMatchType == 'docCheck') {
                        this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF, this.paramsLocais.getOpcoes().dockCheck_secret_hash);
                        this.docCheckService.init();
                    }
                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                    this.showLoading = false;
                    this.cd.detectChanges();
                },
                error => {
                    this.handleError(error);
                }

            );
        this.faceMatchAccountDeletion = this.paramsLocais.getOpcoes().faceMatchAccountBankDeletion;
        switch(this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchAccountBankDeletion);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchAccountBankDeletion);
                this.docCheckService.iframeMessage$.subscribe(message => {
                    if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, last_change_password: true }).subscribe()
                        this.faceMatchActive = true;
                    }
                })
                break;
            default:
                break;            
        }  
        if (!this.faceMatchEnabled) {
            this.faceMatchActive = true;
            this.showLoading = false;
        }        
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            this.legitimuzService.curCustomerIsVerified
                .pipe(takeUntil(this.unsub$))
                .subscribe(curCustomerIsVerified => {
                    if(curCustomerIsVerified == null) return;
                    
                    this.verifiedIdentity = curCustomerIsVerified;
                    if (this.verifiedIdentity) {
                        this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_bank_delete: true }).subscribe({
                            next: (res) => {
                                this.legitimuzFacialService.closeModal();
                                this.messageService.success(this.translate.instant('face_match.verified_identity'));
                                this.faceMatchActive = true;
                                this.cd.detectChanges();
                            }, error: (error) => {
                                this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                                this.faceMatchActive = false;
                            }
                        })
                    }
                });
            this.legitimuzFacialService.faceIndex
            .pipe(takeUntil(this.unsub$))
            .subscribe(faceIndex => {
                if (faceIndex) {
                    this.faceMatchService.updadeFacematch({ document: this.cliente.cpf, account_bank_delete: true }).subscribe({
                        next: (res) => {
                            this.legitimuzFacialService.closeModal();
                            this.messageService.success(this.translate.instant('face_match.verified_identity'));
                            this.faceMatchActive = true;
                            this.cd.detectChanges();
                        }, error: (error) => {
                            this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                            this.faceMatchActive = false;
                        }
                    })
                }
            })
        }
    }

    ngAfterViewInit() {
        if (this.faceMatchEnabled && !this.disapprovedIdentity) {
            if (this.faceMatchType == 'legitimuz') {
                this.legitimuz.changes
                .subscribe(() => {
                    this.legitimuzService.init();
                    this.legitimuzService.mount();
                });
                this.legitimuzLiveness.changes
                .subscribe(() => {
                    this.legitimuzFacialService.init();
                    this.legitimuzFacialService.mount();
                });
            } else {
                this.docCheck.changes
                .subscribe(() => {
                    this.docCheckService.init();
                });
            }
        }
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

}
