import { Component, OnInit, Input} from '@angular/core';
import {ParametrosLocaisService} from './../../../services/parametros-locais.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinanceiroService} from '../../../services/financeiro.service';
import {MessageService} from '../../../services/utils/message.service';
import {Promocao} from '../../../../models';
import {JogosLiberadosBonusModalComponent} from "../jogos-liberados-bonus-modal/jogos-liberados-bonus-modal.component";
import { upperCase } from 'lodash';
@Component({
  selector: 'app-regras-bonus-modal',
  templateUrl: './regras-bonus-modal.component.html',
  styleUrls: ['./regras-bonus-modal.component.css']
})
export class RegrasBonusModalComponent implements OnInit {

    promocoes: Promocao[] = [];
    sections = [];

	constructor(
		public activeModal: NgbActiveModal,
        private paramsLocais: ParametrosLocaisService,
        private financeiroService: FinanceiroService,
        private messageService: MessageService,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.getPromocoes();
    }

    getPromocoes(queryParams?: any) {
        this.financeiroService.getPromocoes(queryParams)
            .subscribe(
                response => {
                    this.promocoes = response;
                    this.promocoes.forEach(promocao => {
                        let title = ''

                        switch(promocao.tipo){
                            case 'primeiro_deposito_bonus': 
                                title = `BÔNUS DE PRIMEIRO DEPÓSITO - APOSTAS ${upperCase(promocao.bonusModalidade)}`
                                break;
                            case 'deposito_bonus':
                                title = `BÔNUS DE DEPÓSITO - APOSTAS ${upperCase(promocao.bonusModalidade)}`
                                break;
                            case 'cadastro_bonus':
                                title = `BÔNUS DE CADASTRO - APOSTAS ${upperCase(promocao.bonusModalidade)}`
                                break;
                            default:
                                title = promocao.nome
                                break;
                        }
                        this.sections.push({title: title, isCollapsed: true})
                    })
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    toggleSection(clickedSection: any) {
        this.sections.forEach(section => {
            if (section !== clickedSection) {
                section.isCollapsed = true;
            }
        });

        clickedSection.isCollapsed = !clickedSection.isCollapsed;
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
