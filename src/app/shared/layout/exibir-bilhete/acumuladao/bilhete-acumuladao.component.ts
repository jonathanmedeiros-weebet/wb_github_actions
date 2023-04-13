import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import {
    ParametrosLocaisService, HelperService, PrintService,
    AuthService, MessageService, ImagensService
} from '../../../../services';
import { toPng } from 'html-to-image';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarregamentoModalComponent, CompatilhamentoBilheteModal } from '../../modals';

let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-bilhete-acumuladao',
    templateUrl: 'bilhete-acumuladao.component.html',
    styleUrls: ['bilhete-acumuladao.component.css']
})

export class BilheteAcumuladaoComponent implements OnInit {
    @ViewChild('cupom', { static: false }) cupom: ElementRef;
    @Input() aposta: any;
    modalRef;
    LOGO;
    opcoes;
    cambistaPaga;
    appMobile;
    isCliente;
    isLoggedIn;
    modalCompartilhamentoRef;
    modalCarregamentoRef;

    constructor(
        private paramsService: ParametrosLocaisService,
        private helperService: HelperService,
        private printService: PrintService,
        private auth: AuthService,
        private messageService: MessageService,
        private imagensService: ImagensService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.LOGO = this.imagensService.logo;
        this.appMobile = this.auth.isAppMobile();
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cliente
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );
        this.opcoes = this.paramsService.getOpcoes();

        if (this.aposta.passador.percentualPremio > 0) {
            this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
        }
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
        };
    }

    shared() {
        if (this.appMobile) {
            this.modalCompartilhamentoRef = this.modalService.open(CompatilhamentoBilheteModal,{
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
                animation: true,
                backdrop: 'static',
            });
            this.modalCompartilhamentoRef.result.then(
                (result) => {
                    console.log(result);
                    switch (result) {
                        case 'imagem':
                            this.openModalCarregamento();
                            toPng(this.cupom.nativeElement).then((dataUrl) => {
                                this.closeModalCarregamento();
                                this.helperService.sharedTicket(this.aposta, dataUrl);
                            });
                            break;
                        case 'link':
                        default:
                            this.helperService.sharedTicket(this.aposta, null);
                            break;
                    }
                },
                (reason) => { }
            );           
        } else {
            if (newNavigator.share) {
                newNavigator.share({
                    title: config.BANCA_NOME,
                    text: `${config.BANCA_NOME}: ${this.aposta.codigo}`,
                    url: `http://${config.HOST}/aposta/${this.aposta.codigo}`,
                });
            } else {
                this.messageService.error('Compartilhamento não suportado pelo seu navegador');
            }
        }
    }

    openModalCarregamento() {
        this.modalCarregamentoRef = this.modalService.open(CarregamentoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            windowClass: 'modal-pop-up',
            centered: true,
            backdrop: 'static',
        });
        this.modalCarregamentoRef.componentInstance.msg = 'Processando Imagem...';
    }

    closeModalCarregamento() {
        if (this.modalCarregamentoRef) {
            this.modalCarregamentoRef.dismiss();
        }
    }

    print() {
        this.printService.bilheteAcumuladao(this.aposta);
    }
}
