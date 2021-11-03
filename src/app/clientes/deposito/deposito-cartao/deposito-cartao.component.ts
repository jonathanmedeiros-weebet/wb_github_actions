import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-deposito-cartao',
    templateUrl: './deposito-cartao.component.html',
    styleUrls: ['./deposito-cartao.component.css']
})
export class DepositoCartaoComponent extends BaseFormComponent implements OnInit {

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
