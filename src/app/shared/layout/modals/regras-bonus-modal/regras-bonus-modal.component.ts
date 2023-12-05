import { Component, OnInit, Input} from '@angular/core';
import {ParametrosLocaisService} from './../../../services/parametros-locais.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinanceiroService} from '../../../services/financeiro.service';
import {MessageService} from '../../../services/utils/message.service';
import {Promocao} from '../../../../models';
import {JogosLiberadosBonusModalComponent} from "../jogos-liberados-bonus-modal/jogos-liberados-bonus-modal.component";
@Component({
  selector: 'app-regras-bonus-modal',
  templateUrl: './regras-bonus-modal.component.html',
  styleUrls: ['./regras-bonus-modal.component.css']
})
export class RegrasBonusModalComponent implements OnInit {

    multiplicador_rollover_esportivo;
    cotacao_minima_aposta_bonus;
    cotacao_minima_aposta_multipla_bonus;
    valor_maximo_bonus_convertido;
    valor_maximo_bonus_primeiro_deposito;
    resultado_multiplicador_bonus;
    vencimento_bonus;
    promocoes: Promocao[] = [];

	constructor(
		public activeModal: NgbActiveModal,
        private paramsLocais: ParametrosLocaisService,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.getPromocoes();

        this.multiplicador_rollover_esportivo = this.paramsLocais.getOpcoes().multiplicador_rollover_esportivo;
        this.cotacao_minima_aposta_bonus = this.paramsLocais.getOpcoes().cotacao_minima_aposta_bonus;
        this.cotacao_minima_aposta_multipla_bonus = this.paramsLocais.getOpcoes().cotacao_minima_aposta_multipla_bonus;
        this.valor_maximo_bonus_convertido = this.paramsLocais.getOpcoes().valor_maximo_bonus_convertido;
        this.valor_maximo_bonus_primeiro_deposito = this.paramsLocais.getOpcoes().valor_maximo_bonus_primeiro_deposito;
        this.vencimento_bonus = this.paramsLocais.getOpcoes().vencimento_bonus;
        this.resultado_multiplicador_bonus = this.multiplicador_rollover_esportivo*50;
    }

    getPromocoes(queryParams?: any) {
        this.financeiroService.getPromocoes(queryParams)
            .subscribe(
                response => {
                    this.promocoes = response;
                    console.log(this.promocoes);
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    exibirJogosLiberadosBonus() {
        // this.location.back();
        this.activeModal.dismiss();
        this.modalService.open(JogosLiberadosBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }
}
