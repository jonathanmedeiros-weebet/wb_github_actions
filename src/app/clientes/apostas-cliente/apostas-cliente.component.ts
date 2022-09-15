import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import * as moment from 'moment';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService, ApostaEsportivaService, AcumuladaoService, DesafioApostaService } from 'src/app/services';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import { forEach } from 'lodash';

@Component({
    selector: 'app-apostas-cliente',
    templateUrl: './apostas-cliente.component.html',
    styleUrls: ['./apostas-cliente.component.css']
})
export class ApostasClienteComponent extends BaseFormComponent implements OnInit, OnDestroy {
    queryParams;
    dataInicial;
    dataFinal;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    casinoHabilitado;
    activeId = 'esporte';

    totais = {
        valor: 0,
        premio: 0,
    }

    loading = false;

    tabSelected = 'esporte';

    apostas = [];

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService,
        private apostaEsportivaService: ApostaEsportivaService,
        private acumuladaoService: AcumuladaoService,
        private cassinoService: CasinoApiService,
        public desafioApostaService: DesafioApostaService,
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cliente'});

        if (moment().day() === 0) {
            const startWeek = moment().startOf('week');
            this.dataInicial = startWeek.subtract(6, 'days');
            this.dataFinal = moment();

        } else {
            this.dataInicial = moment().startOf('week').add('1', 'day');
            this.dataFinal = moment();
        }

        this.loteriasHabilitada = this.params.getOpcoes().loterias;
        this.acumuladaoHabilitado = this.params.getOpcoes().acumuladao;
        this.desafioHabilitado = this.params.getOpcoes().desafio;
        this.casinoHabilitado = this.params.getOpcoes().casino;

        this.createForm();
        this.menuFooterService.setIsPagina(true);

        this.getApostas();
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    getApostas() {
        this.loading = true;

        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'sort': '-horario',
            'otimizado': true
        };


        switch (this.tabSelected) {
            case 'esporte':
                this.apostaEsportivaService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'acumuladao':
                this.acumuladaoService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'desafio':
                this.desafioApostaService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            case 'cassino':
                this.cassinoService.getApostas(queryParams)
                .subscribe(
                    apostas => this.handleResponse(apostas),
                    error => this.handleError(error)
                );
                break;
            default:
                this.handleResponse([]);
                break;
        }
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleResponse(response: any) {
        this.apostas = response;

        this.totais.valor = 0;
        this.totais.premio = 0;

        response.forEach(aposta => {
            if (!aposta.cartao_aposta) {
                this.totais.valor += aposta.valor;
                if (aposta.resultado === 'ganhou') {
                    this.totais.premio += aposta.premio;
                }
            }
        });

        this.loading = false;
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.loading = false;
    }

    submit() {
        this.queryParams = this.form.value;
    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getApostas();
    }

    classNameAposta(resultado) {
        if(resultado == 'perdeu') {
            return 'red';
        } else if (resultado == 'ganhou') {
            return 'green';
        } else {
            return 'default';
        }
    }
}
