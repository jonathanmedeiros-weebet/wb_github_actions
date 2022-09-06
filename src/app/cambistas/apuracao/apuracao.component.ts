import {Component, OnInit} from '@angular/core';
import {RelatorioService} from '../../shared/services/relatorio.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import * as moment from 'moment';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import { SidebarService } from 'src/app/services';

@Component({
    selector: 'app-apuracao',
    templateUrl: './apuracao.component.html',
    styleUrls: ['./apuracao.component.css']
})
export class ApuracaoComponent extends BaseFormComponent implements OnInit {
    queryParams;
    relatorio;
    resultado = 0;
    showLoading = true;
    modoContaCorrente;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    dataSaldoAnterior;
    showEntradas = false;
    showSaidas = false;
    showTotalApostadoDetalhado = false;
    dataInicial;
    dataFinal;
    detalhamentoHabilitado = false;

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private params: ParametrosLocaisService,
        private fb: FormBuilder,
        private sidebarService: SidebarService
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cambista'});

        this.modoContaCorrente = this.params.modoContaCorrente();
        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;

        this.detalhamentoHabilitado = this.loteriasHabilitada || this.acumuladaoHabilitado || this.desafioHabilitado;

        if (moment().day() === 0) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');
            this.dataFinal = moment();

        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.queryParams = {
            dataInicial: this.dataInicial.format('YYYY-MM-DD'),
            dataFinal: this.dataFinal.format('YYYY-MM-DD')
        };

        this.dataSaldoAnterior = moment(this.queryParams.dataInicial).subtract(1, 'day').format('DD/MM');

        this.createForm();
        this.getResultado();
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required]
        });
    }

    submit() {
    }

    getResultado(params?) {
        const queryParams = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal
        };

        this.relatorioService.getResultado(queryParams).subscribe(
            result => {
                this.relatorio = result;
                this.resultado = parseFloat(result['total_apostado']) + parseFloat(result['cartao']) - parseFloat(result['saque'])
                    - parseFloat(result['total_comissao']) - parseFloat(result['total_premios']);
                this.showLoading = false;
            },
            error => {
                this.relatorio = [];
                this.resultado = 0;
                this.showLoading = false;
                this.handleError(error);
            }
        );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    setShowTotalApostadoDetalhado() {
        if (this.detalhamentoHabilitado) {
            this.showTotalApostadoDetalhado = !this.showTotalApostadoDetalhado;
        }
    }
}
