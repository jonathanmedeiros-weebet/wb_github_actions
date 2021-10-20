import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {MovimentacaoFinanceira} from '../../shared/models/clientes/movimentacao-financeira';
import {ClienteService} from '../../shared/services/clientes/cliente.service';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import * as moment from 'moment';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';

@Component({
    selector: 'app-financeiro',
    templateUrl: './financeiro.component.html',
    styleUrls: ['./financeiro.component.css']
})
export class FinanceiroComponent extends BaseFormComponent implements OnInit {
    movimentacoesFinanceiras: MovimentacaoFinanceira[] = [];
    totalMovimentacoes;
    queryParams;
    dataInicial;
    dataFinal;
    showLoading = true;
    smallScreen = false;
    page = 1;
    movimentacoesContent;
    saldo;
    contatoSolicitacaoSaque;

    constructor(
        private clienteService: ClienteService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private el: ElementRef,
        private renderer: Renderer2,
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit(): void {
        this.contatoSolicitacaoSaque = this.paramsLocais.getOpcoes().contato_solicitacao_saque.replace(/\D/g, '');
        if (moment().day() === 0) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');
            this.dataFinal = moment();

        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        if (window.innerWidth < 669) {
            this.smallScreen = true;
        } else {
            this.smallScreen = false;
        }

        this.definirAltura();

        this.createForm();
    }

    getMovimentacoes(queryParams?: any) {
        this.showLoading = true;
        this.clienteService.getMovimentacaoFinanceira(queryParams)
            .pipe()
            .subscribe(
                response => {
                    console.log(response);
                    this.movimentacoesFinanceiras = response.results.movimentacoes;
                    this.totalMovimentacoes = response.pagination.total;
                    this.saldo = response.results.saldo;
                    this.showLoading = false;
                },
                error => {
                    this.handleError(error);
                    this.movimentacoesFinanceiras = [];
                    this.showLoading = false;
                }
            );
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        this.movimentacoesContent = this.el.nativeElement.querySelector('.content-movimentacoes');
        this.renderer.setStyle(this.movimentacoesContent, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            tipo: [''],
        });

        this.submit();
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.queryParams = this.form.value;
        const queryParams: any = {
            'dataInicial': this.queryParams.dataInicial,
            'dataFinal': this.queryParams.dataFinal,
            'tipo': this.queryParams.tipo,
            'page': this.page
        };
        this.getMovimentacoes(queryParams);
    }
}
