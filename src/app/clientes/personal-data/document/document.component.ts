import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountVerificationService, ClienteService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { DocCheckService } from 'src/app/shared/services/doc-check.service';
import { FaceMatchService } from 'src/app/shared/services/face-match.service';
import { LegitimuzService } from 'src/app/shared/services/legitimuz.service';

export interface CustomerResponse {
    cpf: string;
    nome: string;
    sobrenome: string;
    dataNascimento: string;
    nationality: string;
    genero: string;
    verifiedIdentity: boolean;
}

declare global {
    interface Window {
        ex_partner: any;
        exDocCheck: any;
        exDocCheckAction: any;
    }
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit, AfterViewInit {
    @ViewChildren('legitimuz') private legitimuz: QueryList<ElementRef>;
    @ViewChildren('docCheck') private docCheck: QueryList<ElementRef>;
    customer: any;
    dataUserCPF = '';
    faceMatchEnabled = false;
    faceMatchType = 'legitimuz';
    legitimuzToken = '';
    docCheckToken = '';
    secretHash = '';
    faceMatchChangePasswordValidated = false;
    disapprovedIdentity = false;
    verifiedIdentity = false;
    public verificationRequired: boolean = false;

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private translate: TranslateService,
        private paramsLocais: ParametrosLocaisService,
        private docCheckService: DocCheckService,
        private legitimuzService: LegitimuzService,
        private faceMatchService: FaceMatchService,
        private cd: ChangeDetectorRef,
        private accountVerificationService: AccountVerificationService
    ) {}
   
    ngOnInit() {
        this.faceMatchType = this.paramsLocais.getOpcoes().faceMatchType;
        this.loadCustomerEmail();
        this.verifyAccountVerificationStep();

        switch (this.faceMatchType) {
            case 'legitimuz':
                this.legitimuzToken = this.paramsLocais.getOpcoes().legitimuz_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.legitimuzToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                break;
            case 'docCheck':
                this.docCheckToken = this.paramsLocais.getOpcoes().dockCheck_token;
                this.faceMatchEnabled = Boolean(this.paramsLocais.getOpcoes().faceMatch && this.docCheckToken && this.paramsLocais.getOpcoes().faceMatchChangePassword);
                this.docCheckService.iframeMessage$.subscribe(async (message) => {
                    if (message.StatusPostMessage.Status == 'APROVACAO_AUTOMATICA' || message.StatusPostMessage.Status == 'APROVACAO_MANUAL') {
                        await this.faceMatchService.updadeFacematch({ document: this.customer.cpf, register: true }).toPromise()
                        this.faceMatchChangePasswordValidated = true;
                        this.accountVerificationService.getAccountVerificationDetail().toPromise();
                    }
                });
                break;
            default:
                break;
        }

        if (this.faceMatchEnabled && !this.disapprovedIdentity && this.faceMatchType == 'legitimuz') {
            this.legitimuzService.curCustomerIsVerified
                .subscribe(async (curCustomerIsVerified) => {
                    this.verifiedIdentity = curCustomerIsVerified;
                    this.cd.detectChanges();
                    if (this.verifiedIdentity) {
                        this.legitimuzService.closeModal();
                        this.messageService.success(this.translate.instant('face_match.verified_identity'));
                        await this.faceMatchService.updadeFacematch({ document: this.dataUserCPF, register: true }).toPromise()
                        this.faceMatchChangePasswordValidated = true;
                        this.accountVerificationService.getAccountVerificationDetail().toPromise();
                    } else {
                        this.legitimuzService.closeModal();
                        this.messageService.error(this.translate.instant('face_match.Identity_not_verified'));
                        this.faceMatchChangePasswordValidated = false;
                        this.accountVerificationService.getAccountVerificationDetail().toPromise();
                    }
                });
        }
    }

    private verifyAccountVerificationStep() {
        this.accountVerificationService.verifiedSteps.subscribe(({document}) => {
            if(document != undefined) {
                this.verificationRequired = !Boolean(document);
            }
        })
    }

    loadCustomerEmail() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.clienteService.getCliente(user.id)
            .subscribe({
                next: (res: CustomerResponse) => {
                    this.customer = res;
                    this.dataUserCPF = String(this.customer.cpf).replace(/[.\-]/g, '');
                    if (this.faceMatchType == 'docCheck') {
                        this.secretHash = this.docCheckService.hmacHash(this.dataUserCPF, this.paramsLocais.getOpcoes().dockCheck_secret_hash);
                    }
                    this.verifiedIdentity = res.verifiedIdentity;
                    this.disapprovedIdentity = typeof this.verifiedIdentity === 'boolean' && !this.verifiedIdentity;
                },
                error: () => {
                    this.messageService.error(this.translate.instant('erroInesperado'));
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
