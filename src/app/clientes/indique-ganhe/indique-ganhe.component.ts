import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../shared/config';

import { ClienteService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';

@Component({
  selector: 'app-indique-ganhe',
  templateUrl: './indique-ganhe.component.html',
  styleUrls: ['./indique-ganhe.component.css']
})
export class IndiqueGanheComponent implements OnInit {
    @ViewChild('regrasCondicoesModal', {static: true}) regrasCondicoesModal;
    linkIndicacao;
    valorGanhoPorIndicacao;

    linkFacebook;
    linkWhatsapp;
    linkTelegram;
    linkEmail;
    linkInstagram;

    mobileScreen;

    constructor(
        private activeModal: NgbActiveModal,
        private clienteService: ClienteService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private paramsLocaisService: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.valorGanhoPorIndicacao = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_por_indicacao;
        this.mobileScreen = window.innerWidth <= 1024;

        this.clienteService.getLinkIndicacao()
            .subscribe(
                response => {
                    this.linkIndicacao = response.linkIndicacao;
                    let urlEncodedLinkIndicacao = response.linkIndicacao.replace(/\//g, "%2F").replace(/\:/g, "%3A").replace(/\?/g, "%3F").replace(/\=/, "%3D");
                    this.linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${urlEncodedLinkIndicacao}`;
                    this.linkWhatsapp = `https://api.whatsapp.com/send/?text=${urlEncodedLinkIndicacao}&type=custom_url&app_absent=0`;
                    this.linkTelegram = `https://telegram.me/share/url?url=${urlEncodedLinkIndicacao}&text=Cadastre-se%20na%20${config.BANCA_NOME}%21`;
                    this.linkEmail = `mailto:info@example.com?&subject=&cc=&bcc=&body=${urlEncodedLinkIndicacao}%0A`;
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
        this.activeModal = this.modalService.open(
            this.regrasCondicoesModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
    }

    copiarLink() {
        navigator.clipboard.writeText(this.linkIndicacao);
        this.messageService.success(this.translateService.instant('geral.linkCopiado'));
    }
}
