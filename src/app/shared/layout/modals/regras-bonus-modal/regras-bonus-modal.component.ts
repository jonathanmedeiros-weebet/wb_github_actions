import { Component, OnInit, Input} from '@angular/core';
import {ParametrosLocaisService} from './../../../services/parametros-locais.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

	constructor(
		public activeModal: NgbActiveModal,
        private paramsLocais: ParametrosLocaisService
	) { }

    ngOnInit(): void {

        this.multiplicador_rollover_esportivo = this.paramsLocais.getOpcoes().multiplicador_rollover_esportivo;
        this.cotacao_minima_aposta_bonus = this.paramsLocais.getOpcoes().cotacao_minima_aposta_bonus;
        this.cotacao_minima_aposta_multipla_bonus = this.paramsLocais.getOpcoes().cotacao_minima_aposta_multipla_bonus;
        this.valor_maximo_bonus_convertido = this.paramsLocais.getOpcoes().valor_maximo_bonus_convertido;
        this.valor_maximo_bonus_primeiro_deposito = this.paramsLocais.getOpcoes().valor_maximo_bonus_primeiro_deposito;
        this.vencimento_bonus = this.paramsLocais.getOpcoes().vencimento_bonus;
        this.resultado_multiplicador_bonus = this.multiplicador_rollover_esportivo*50;
    }
}
