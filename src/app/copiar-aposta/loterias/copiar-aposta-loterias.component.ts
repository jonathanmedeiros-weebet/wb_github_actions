import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    MessageService,
    SorteioService,
    ApostaLoteriaService,
    ParametrosLocaisService
} from '../../services';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-copiar-aposta-loterias',
    templateUrl: 'copiar-aposta-loterias.component.html',
    styleUrls: ['./copiar-aposta-loterias.component.css']
})
export class CopiarApostaLoteriasComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() success = new EventEmitter();
    @Input() preAposta: any;
    preApostaItens = [];
    disabled = false;
    sorteios = [];
    opcoes;
    unsub$ = new Subject();

    constructor(
        private sorteioService: SorteioService,
        private apostaLoteriaService: ApostaLoteriaService,
        private messageService: MessageService,
        private fb: UntypedFormBuilder,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.opcoes = this.paramsService.getOpcoes();

        this.sorteioService
            .getSorteios()
            .subscribe(sorteios => (this.sorteios = sorteios));

        this.createForm();
        this.preApostaItens = this.preAposta.itens;
        this.form.patchValue(this.preAposta);
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', Validators.required],
            valor: ['', Validators.required]
        });
    }

    removerItem(i) {
        this.preAposta.itens.splice(i, 1);

        this.preAposta.valor = this.preAposta.itens
            .map(item => item.valor)
            .reduce((acumulador, valorAtual) => acumulador * valorAtual);
    }

    submit() {
        this.disabledSubmit();

        const values = this.form.value;
        values.preaposta_codigo = this.preAposta.codigo;

        values.telefone = this.preAposta.telefone;
        values.versao_app = 'angular';

        values.itens = this.preApostaItens.map(item => {
            return {
                valor: item.valor,
                sorteio_id: item.sorteio_id,
                numeros: item.numeros
            };
        });

        if (values.itens.length) {
            this.apostaLoteriaService
                .create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => {
                        this.enableSubmit();
                        this.success.emit(result);
                    },
                    error => this.handleError(error)
                );
        } else {
            this.handleError('Nenhum palpite na aposta!');
        }
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    calcularEstimativaGanho(cotacao, valor) {
        let estimativaGanho = valor * cotacao;
        if (estimativaGanho > this.opcoes.valor_max_premio_loterias) {
            estimativaGanho = this.opcoes.valor_max_premio_loterias;
        }
        return estimativaGanho;
    }
}
