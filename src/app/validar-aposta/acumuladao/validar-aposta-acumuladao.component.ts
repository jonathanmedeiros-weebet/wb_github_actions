import {
    Component, OnInit, OnDestroy,
    Input, Output, EventEmitter
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    MessageService,
    AcumuladaoService
} from '../../services';
import { Acumuladao } from '../../models';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-validar-aposta-acumuladao',
    templateUrl: 'validar-aposta-acumuladao.component.html',
    styleUrls: ['./validar-aposta-acumuladao.component.css']
})
export class ValidarApostaAcumuladaoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() success = new EventEmitter();
    @Input() preAposta: any;
    acumuladao = new Acumuladao();
    disabled = false;
    unsub$ = new Subject();

    constructor(
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.acumuladao = this.preAposta.acumuladao;
        this.form.patchValue(this.preAposta);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', Validators.required]
        });
    }

    submit() {
        this.disabledSubmit();

        const values = {
            apostador: this.form.value.apostador,
            preaposta_id: this.preAposta.id,
            acumuladao_id: this.acumuladao.id,
            jogos: []
        };

        values.jogos = this.preAposta.itens.map(item => {
            return {
                id: item.jogo.id,
                time_a_resultado: item.time_a_resultado,
                time_b_resultado: item.time_b_resultado
            };
        });

        this.acumuladaoService
            .createAposta(values)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                result => {
                    this.enableSubmit();
                    this.success.emit(result);
                },
                error => this.handleError(error)
            );
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }
}
