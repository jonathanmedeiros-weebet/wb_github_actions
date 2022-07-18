import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import * as moment from 'moment';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';

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

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private params: ParametrosLocaisService,
        private menuFooterService: MenuFooterService
    ) {
        super();
    }

    ngOnInit() {
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
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.dataInicial.format('YYYY-MM-DD'), Validators.required],
            dataFinal: [this.dataFinal.format('YYYY-MM-DD'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    submit() {
        this.queryParams = this.form.value;
    }

}
