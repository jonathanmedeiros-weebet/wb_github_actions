import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageService, SorteioService, ApostaLoteriaService, ParametrosLocaisService } from '../../services';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-copiar-aposta-loterias',
    templateUrl: 'copiar-aposta-loterias.component.html',
    styleUrls: ['./copiar-aposta-loterias.component.css']
})
export class CopiarApostaLoteriasComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() success = new EventEmitter();
    @Input() preAposta: any;
    disabled = false;
    sorteios = [];
    opcoes;
    unsub$ = new Subject();
    form: FormGroup;

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
        this.sorteioService.getSorteios().subscribe(sorteios => (this.sorteios = sorteios));
        this.createForm();
        this.populateForm();

        this.sorteioService.getSorteios({tipo: 'quininha', sort: 'data'})
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                sorteios => this.sorteios = sorteios,
                error => this.messageService.error(error)
            );
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', Validators.required],
            preApostaItens: this.fb.array([])
        });
    }

    populateForm() {
        this.preAposta.itens.forEach(item => {
            this.preApostaItens.push(this.createPreApostaItem(item));
        });
        this.form.patchValue({ apostador: this.preAposta.apostador });
    }

    get preApostaItens(): FormArray {
        return this.form.get('preApostaItens') as FormArray;
    }

    createPreApostaItem(item: any): FormGroup {
        return this.fb.group({
            sorteio_id: [item.sorteio_id],
            valor: [item.valor, Validators.required],
            numeros: [item.numeros],
            cotacao6: [item.cotacao6],
            cotacao5: [item.cotacao5],
            cotacao4: [item.cotacao4],
            cotacao3: [item.cotacao3]
        });
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }

    calcularEstimativaGanho(cotacao, valor) {
        let estimativaGanho = valor * cotacao;
        if (estimativaGanho > this.opcoes.valor_max_premio_loterias) {
            estimativaGanho = this.opcoes.valor_max_premio_loterias;
        }
        return estimativaGanho;
    }

    updateEstimativaGanho(item, index) {
        const control = this.preApostaItens.at(index);
        const valor = control.get('valor').value;
        const cotacaoOriginal6 = control.get('cotacao_original_6').value;
        const cotacaoOriginal5 = control.get('cotacao_original_5').value;
        const cotacaoOriginal4 = control.get('cotacao_original_4').value;
        const cotacaoOriginal3 = control.get('cotacao_original_3').value;

        control.patchValue({
            cotacao6: this.calcularEstimativaGanho(cotacaoOriginal6, valor),
            cotacao5: this.calcularEstimativaGanho(cotacaoOriginal5, valor),
            cotacao4: this.calcularEstimativaGanho(cotacaoOriginal4, valor),
            cotacao3: this.calcularEstimativaGanho(cotacaoOriginal3, valor)
        });
    }

    removerItem(i) {
        this.preApostaItens.removeAt(i);
    }

    submit() {
        this.disabledSubmit();

        const values = this.form.value;
        values.preaposta_codigo = this.preAposta.codigo;
        values.telefone = this.preAposta.telefone;
        values.versao_app = 'angular';

        if (values.preApostaItens.length) {
            this.apostaLoteriaService.create(values)
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

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }
}
