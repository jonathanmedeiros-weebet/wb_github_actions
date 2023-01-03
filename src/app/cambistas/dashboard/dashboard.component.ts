import {Component, OnInit, ViewChild} from '@angular/core';
import {RelatorioService} from '../../shared/services/relatorio.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import * as moment from 'moment';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { SidebarService, AuthService, CambistaService } from 'src/app/services';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApostaComponent} from '../aposta/aposta.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseFormComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public saldo;
    public credito;

    public dataEntrada = [];
    public dataSaida = [];

    public showLoading = true;
    public barChartType: ChartType = 'bar';
    public barChartPlugins = [];
    public barChartData: ChartData<'bar'> = {
        labels: [ 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom' ],
        datasets: [
            { data: this.dataEntrada, label: 'Entrada', backgroundColor: '#35CC95', borderRadius: 2, maxBarThickness: 20, categoryPercentage: 0.4  },
            { data: this.dataSaida, label: 'Saída', backgroundColor: '#ED4C5C', borderRadius: 2, maxBarThickness: 20, categoryPercentage: 0.4  }
        ]
    };
    public barChartOptions: ChartConfiguration['options'];

    isMobile = false;

    public apostasRealizadasEsporte = {'quantidade': 0, 'valor_apostas': 0};
    public apostasRealizadasAcumuladao = {'quantidade': 0, 'valor_apostas': 0};
    public apostasRealizadasDesafio = {'quantidade': 0, 'valor_apostas': 0};
    public apostasRealizadasCassino = {'quantidade': 0, 'valor_apostas': 0};

    constructor(
        private relatorioService: RelatorioService,
        private messageService: MessageService,
        private params: ParametrosLocaisService,
        private fb: FormBuilder,
        private sidebarService: SidebarService,
        private auth: AuthService,
        private cambistaService: CambistaService,
        private modalService: NgbModal,
        private router: Router,
        public activeModal: NgbActiveModal
    ) {
        super();
    }

    ngOnInit() {
        this.sidebarService.changeItens({contexto: 'cambista'});
        this.showLoading = false;

        if (window.innerWidth <= 1024) {
            this.isMobile = true;
        }

        var style = getComputedStyle(document.body);

        this.barChartOptions = {
            responsive: true,
            borderColor: "#fff",
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: style.getPropertyValue('--foreground-game'),
                    },
                    grid: {
                        color: style.getPropertyValue('--foreground-game'),
                        borderDash: [4, 2],
                    }
                },
                y: {
                    min: 10,
                    ticks: {
                        color: style.getPropertyValue('--foreground-game'),
                    },
                    grid: {
                        color: style.getPropertyValue('--foreground-game'),
                        borderDash: [4, 2],
                    }
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: "rectRounded",
                        color: style.getPropertyValue('--foreground-game'),
                    }
                }
            }
        };

        this.loadChart('semana-atual');
        this.loadQuantidadeApostas('semana-atual');

        this.auth.getPosicaoFinanceira()
            .subscribe(
                posicaoFinanceira => {
                    this.saldo = posicaoFinanceira.saldo
                    this.credito = posicaoFinanceira.credito
                },
                error => {
                    if (error === 'Não autorizado.' || error === 'Login expirou, entre novamente.') {
                        this.auth.logout();
                    } else {
                        this.handleError(error);
                    }
                }
            );
    }

    loadQuantidadeApostas(periodo) {
        const params = { periodo }

        this.cambistaService.quantidadeApostas(params).subscribe(
            data => {
                this.apostasRealizadasEsporte = data?.esporte;
                this.apostasRealizadasAcumuladao = data?.acumuladao;
                this.apostasRealizadasDesafio = data?.desafio;
                this.apostasRealizadasCassino = data?.cassino;
            },
            error => {
                console.error(error);
            }
        )
    }

    loadChart(periodo) {
        const params = { periodo }

        this.cambistaService.fluxoCaixa(params).subscribe(
            data => {
                this.barChartData.datasets[0].data = data.entrada;
                this.barChartData.datasets[1].data = data.saida;

                this.chart?.update();
            },
            error => {
                console.error(error);
            }
        )
    }

    handleFiltroApostasRealizadas(event) {
        let value = event.target.options[event.target.options.selectedIndex].value;
        this.loadQuantidadeApostas(value);
    }

    handleFiltroFluxoCaixa(event) {
        let value = event.target.options[event.target.options.selectedIndex].value;
        this.loadChart(value);
    }

    createForm() {

    }

    submit() {

    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        // console.log(event, active);
    }

    chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        // console.log(event, active);
    }

    abrirCambistaApostas() {
        if (this.isMobile) {
            this.modalService.open(ApostaComponent);
        } else {
            this.router.navigate(['/cambistas/apostas']);
        }
    }
}
