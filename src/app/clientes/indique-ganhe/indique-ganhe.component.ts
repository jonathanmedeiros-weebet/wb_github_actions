import { Component, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthService, ClienteService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';

declare var WeebetMessage: any;

@Component({
  selector: 'app-indique-ganhe',
  templateUrl: './indique-ganhe.component.html',
  styleUrls: ['./indique-ganhe.component.css']
})
export class IndiqueGanheComponent implements OnInit {
    @ViewChild('regrasCondicoesModal', {static: true}) regrasCondicoesModal;
    linkIndicacao: string = "";
    valorGanhoPorIndicacao;

    linkFacebook;
    linkWhatsapp;
    linkTelegram;
    linkEmail;

    mobileScreen;
    isAppMobile;

    constructor(
        private activeModal: NgbActiveModal,
        private activeRulesModal: NgbActiveModal,
        private authService: AuthService,
        private clienteService: ClienteService,
        private clipboard: Clipboard,
        private messageService: MessageService,
        private modalService: NgbModal,
        private paramsLocaisService: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.valorGanhoPorIndicacao = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_por_indicacao;
        this.mobileScreen = window.innerWidth <= 1024;
        this.isAppMobile = this.authService.isAppMobile();

        this.clienteService.getCodigoIndicacao()
            .subscribe(
                response => {
                    this.linkIndicacao = `${location.origin}/cadastro?refId=${response.codigoIndicacao}`;

                    let indicacaoMsg = encodeURIComponent("Quer ganhar uma graninha extra e se divertir?\nÉ só criar uma conta através deste link e aproveitar!");

                    this.linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.linkIndicacao)}`;
                    this.linkWhatsapp = `https://api.whatsapp.com/send/?text=${indicacaoMsg}%0A${encodeURIComponent(this.linkIndicacao)}&type=custom_url&app_absent=0`;
                    this.linkTelegram = `https://telegram.me/share/url?url=${encodeURIComponent(this.linkIndicacao)}&text=${indicacaoMsg}`;
                    this.linkEmail = `mailto:?&subject=&cc=&bcc=&body=${encodeURIComponent(this.linkIndicacao)}%0A`;
                },
                error => {
                    this.messageService.error(error);
                }
            );

        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        }
    }

    abrirModalRegras()
    {
        this.activeRulesModal = this.modalService.open(
            this.regrasCondicoesModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
    }

    copiarLink() {
        if (this.linkIndicacao && this.clipboard.copy(this.linkIndicacao)) {
            this.messageService.success(this.translateService.instant('geral.linkCopiado'));
        }
    }

    compartilharLink() {
        if (this.linkIndicacao) {
            if (this.isAppMobile) {
                WeebetMessage.postMessage(JSON.stringify({
                    message: "",
                    data: this.linkIndicacao,
                    action: 'shareURL'
                }));
            } else {
                if (window.navigator.share) {
                    window.navigator.share({
                        title: "",
                        text: "",
                        url: this.linkIndicacao
                    })
                } else {
                    this.messageService.error('Compartilhamento não suportado pelo seu navegador');
                }
            }
        }
    }
}
