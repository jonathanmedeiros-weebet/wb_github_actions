import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from '../../shared/services/utils/message.service';
import * as moment from 'moment';

@Component({
    selector: 'app-apostas-cliente',
    templateUrl: './apostas-cliente.component.html',
    styleUrls: ['./apostas-cliente.component.css']
})
export class ApostasClienteComponent extends BaseFormComponent implements OnInit {
    queryParams;
    dataInicial;
    dataFinal;
    loteriasHabilitada;
    acumuladaoHabilitado;
    desafioHabilitado;
    activeId = 'esporte';

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder
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


        this.createForm();
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
