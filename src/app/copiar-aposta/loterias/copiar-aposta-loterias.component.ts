import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
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
    @ViewChild('apostaContainer', { static: false }) apostaContainer: ElementRef;
    @Output() success = new EventEmitter();
    @Input() aposta: any;
    disabled = false;
    sorteios = [];
    opcoes;
    unsub$ = new Subject();
    form: FormGroup;
    modalidade;

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
        this.createForm();
        this.populateForm();

        this.sorteioService.getSorteios({tipo: this.aposta.modalidade, sort: 'data'})
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
            itens: this.fb.array([])
        });
    }


    cleanForm() {
        if (this.apostaContainer) {
            this.apostaContainer.nativeElement.innerHTML = '';
        }
    }

    populateForm() {
        this.aposta.itens.forEach(item => {
            this.apostaItens.push(this.createApostaItem(item));
        });
        this.form.patchValue({ apostador: this.aposta.apostador });
    }

    get apostaItens(): FormArray {
        return this.form.get('itens') as FormArray;
    }

    createApostaItem(item: any): FormGroup {
        return this.fb.group({
            sorteio_id: [""],
            valor: [0, Validators.required],
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
        const control = this.apostaItens.at(index);
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
        this.apostaItens.removeAt(i);
    }

    submit() {
        this.disabledSubmit();
        const values = this.form.value;
        if (values.itens.length) {
            console.log(values)
            this.apostaLoteriaService.create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => {
                        this.cleanForm();
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
