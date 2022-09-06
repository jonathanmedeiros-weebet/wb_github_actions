import {Component, OnInit, ViewChild} from '@angular/core';
import {RelatorioService} from '../../shared/services/relatorio.service';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import * as moment from 'moment';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { SidebarService } from 'src/app/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseFormComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public showLoading = true;
    public barChartType: ChartType = 'bar';
    public barChartPlugins = [];
    public barChartData: ChartData<'bar'> = {
        labels: [ 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom' ],
        datasets: [
            { data: [ 170, 730, 540, 201, 402, 632, 580 ], label: 'Entrada', backgroundColor: '#35CC95', borderRadius: 2, maxBarThickness: 20,  },
            { data: [ 128, 320, 300, 104, 398, 410, 490 ], label: 'Saída', backgroundColor: '#ED4C5C', borderRadius: 2, maxBarThickness: 20  }
        ]
    };
    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        borderColor: "#ffffff",
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: "#fff",
                },
                grid: {
                    color: '#535353',
                    borderDash: [4, 2],
                }
            },
            y: {
                min: 10,
                ticks: {
                    color: "#fff",
                },
                grid: {
                    color: '#535353',
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
                    color: '#fff',
                }
            }
        }
    };

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
        this.showLoading = false;
    }

    createForm() {

    }

    submit() {

    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }
}
