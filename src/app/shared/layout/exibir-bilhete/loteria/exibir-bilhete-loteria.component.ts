import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import {
    SorteioService, ParametrosLocaisService, PrintService,
    HelperService, AuthService, ImagensService,
    MessageService
} from '../../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { toPng } from 'html-to-image';
import { config } from './../../../config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarregamentoModalComponent, CompatilhamentoBilheteModal } from '../../modals';

let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-exibir-bilhete-loteria',
    templateUrl: 'exibir-bilhete-loteria.component.html',
    styleUrls: ['exibir-bilhete-loteria.component.css']
})

export class ExibirBilheteLoteriaComponent implements OnInit, OnDestroy {
    @ViewChild('cupom', { static: false }) cupom: ElementRef;
    @Input() aposta: any;
    LOGO;
    informativoRodape;
    sorteios = [];
    unsub$ = new Subject();
    isCliente;
    isLoggedIn;
    appMobile;
    netPrize = 0;
    modalCompartilhamentoRef;
    modalCarregamentoRef;

    constructor(
        private paramsService: ParametrosLocaisService,
        private sorteioService: SorteioService,
        private printService: PrintService,
        private helperService: HelperService,
        private authService: AuthService,
        private imagensService: ImagensService,
        private messageService: MessageService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.LOGO = this.imagensService.logo;
        const opcoes = this.paramsService.getOpcoes();
        this.informativoRodape = opcoes.informativoRodape;
        this.appMobile = this.authService.isAppMobile();
        this.isCliente = this.authService.isCliente();
        this.isLoggedIn = this.authService.isLoggedIn();
        this.calculateNetPrize();

        this.sorteioService.getSorteios()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios
            );
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }

    verificarStatus(apostaItem, tipo) {
        let result = false;
        if (apostaItem.status === 'ganhou') {
            const tipoPremio = apostaItem.tipo_premio;
            if (tipo === 6 && tipoPremio === 'sena') {
                result = true;
            }

            if (tipo === 5 && tipoPremio === 'quina') {
                result = true;
            }

            if (tipo === 4 && tipoPremio === 'quadra') {
                result = true;
            }

            if (tipo === 3 && tipoPremio === 'terno') {
                result = true;
            }
        }

        return { 'ganhou': result };
    }

    shared() {
        if (this.appMobile) {
            this.modalCompartilhamentoRef = this.modalService.open(CompatilhamentoBilheteModal, {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
                animation: true,
                backdrop: 'static',
            });
            this.modalCompartilhamentoRef.result.then(
                (result) => {
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
        this.printService.lotteryTicket(this.aposta);
    }

    calculateNetPrize() {
        this.netPrize = 0;
        let prizes = 0;

        this.aposta.itens.forEach(item => {
            if (item.status === 'ganhou') {
                prizes += item.premio;
            }
        });

        this.netPrize = prizes * ((100 - this.aposta.passador.percentualPremio) / 100);
        this.aposta.netPrize;
    }
}
