import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../shared/layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-deposito-pix',
    templateUrl: './deposito-pix.component.html',
    styleUrls: ['./deposito-pix.component.css']
})
export class DepositoPixComponent extends BaseFormComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit() {
    }

    createForm() {
        this.form = this.fb.group({
            valor: [null, Validators.required]
        });
    }

    handleError(error: string) {
    }

    submit() {
    }

}
