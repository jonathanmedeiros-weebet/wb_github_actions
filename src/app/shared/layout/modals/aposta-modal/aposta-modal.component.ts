import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ExibirBilheteEsportivoComponent } from '../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { BilheteAcumuladaoComponent } from './../../exibir-bilhete/acumuladao/bilhete-acumuladao.component';
import { ExibirBilheteDesafioComponent } from './../../exibir-bilhete/desafio/exibir-bilhete-desafio.component';
import { ExibirBilheteLoteriaComponent } from './../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HelperService, AuthService, ParametrosLocaisService, ApostaService} from '../../../../services';
import {ApostaEncerramentoModalComponent} from '../aposta-encerramento-modal/aposta-encerramento-modal.component';

@Component({
    selector: 'app-aposta-modal',
    templateUrl: './aposta-modal.component.html',
    styleUrls: ['./aposta-modal.component.css']
})
export class ApostaModalComponent implements OnInit {
    @ViewChild(ExibirBilheteEsportivoComponent) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    @ViewChild(ExibirBilheteLoteriaComponent) bilheteLoteriaComponent: ExibirBilheteLoteriaComponent;
    @ViewChild(ExibirBilheteDesafioComponent) bilheteDesafioComponent: ExibirBilheteDesafioComponent;
    @ViewChild(BilheteAcumuladaoComponent) bilheteAcumuladaoComponent: BilheteAcumuladaoComponent;
    @Input() aposta;
    @Input() apuracao;
    @Input() showCancel = false;
    @Input() primeiraImpressao = false;
    @Input() isUltimaAposta = false;
    appMobile;
    casaDasApostasId;
    isLoggedIn;
    modalRef;
    showLoading = true;

    constructor(
        public activeModal: NgbActiveModal,
        private helperService: HelperService,
        private paramsLocais: ParametrosLocaisService,
        private auth: AuthService,
        private modalService: NgbModal,
        private apostaService: ApostaService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.isLoggedIn = this.auth.isLoggedIn();
        this.casaDasApostasId = this.paramsLocais.getOpcoes().casa_das_apostas_id;
    }

    printTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.print();
        }
        if (this.aposta.tipo === 'loteria') {
            this.bilheteLoteriaComponent.print();
        }
        if (this.aposta.tipo === 'acumuladao') {
            this.bilheteAcumuladaoComponent.print();
        }
        if (this.aposta.tipo === 'desafio') {
            this.bilheteDesafioComponent.print();
        }
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.shared();
        }
        if (this.aposta.tipo === 'loteria') {
            this.bilheteLoteriaComponent.shared();
        }
        if (this.aposta.tipo === 'acumuladao') {
            this.bilheteAcumuladaoComponent.shared();
        }
        if (this.aposta.tipo === 'desafio') {
            this.bilheteDesafioComponent.shared();
        }
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
        this.activeModal.close('pagamento');
    }

    pagamentoPermitido() {
        return this.aposta.resultado && this.aposta.resultado === 'ganhou' && !this.aposta.pago && !this.aposta.cartao_aposta;
    }

    cancelamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.showCancel && this.isLoggedIn) {
            if (opcoes.habilitar_cancelar_aposta) {
                result = true;
            } else if (opcoes.habilitar_cancelar_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
    }

    compartilhamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (opcoes.habilitar_compartilhamento_comprovante) {
            result = true;
        }

        return result;
    }

    impressaoPermitida() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.primeiraImpressao) {
            result = true;
        } else {
            if (opcoes.permitir_reimprimir_aposta) {
                result = true;
            }

            if (opcoes.permitir_reimprimir_ultima_aposta && this.isUltimaAposta) {
                result = true;
            }
        }

        return result;
    }

    linkCasaDasApostasPermitido() {
        if (this.appMobile) {
            return this.casaDasApostasId;
        } else {
            return false;
        }
    }

    openCasaDasApostas() {
        if (this.casaDasApostasId) {
            const url = `http://casadasapostas.net/bilhete?banca=${this.casaDasApostasId}&codigo=${this.aposta.id}`;
            this.helperService.sharedCasaDasApostaUrl(url);
        }
    }

    encerramentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (opcoes.permitir_encerrar_aposta) {
            result = true;
        }

        return result;
    }

    openModalEncerramento(aposta) {
        this.showLoading = true;

        this.apostaService.getAposta(aposta.id)
            .subscribe(
                apostaLocalizada => {
                    this.modalRef = this.modalService.open(ApostaEncerramentoModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        scrollable: true
                    });
                    this.modalRef.componentInstance.aposta = apostaLocalizada;
                    this.showLoading = false;
                }
            );
    }
}
