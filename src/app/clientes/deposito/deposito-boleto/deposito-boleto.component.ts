import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-deposito-boleto',
    templateUrl: './deposito-boleto.component.html',
    styleUrls: ['./deposito-boleto.component.css']
})
export class DepositoBoletoComponent extends BaseFormComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    createForm() {
    }

    handleError(error: string) {
    }

    submit() {
    }

}
