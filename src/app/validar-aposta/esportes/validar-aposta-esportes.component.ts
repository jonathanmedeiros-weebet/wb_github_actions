import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';
import { takeUntil } from 'rxjs/operators';
import {
    MessageService,
    ApostaEsportivaService,
    HelperService,
    ParametrosLocaisService
} from '../../services';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';

@Component({
    selector: 'app-validar-aposta-esportes',
    templateUrl: 'validar-aposta-esportes.component.html',
    styleUrls: ['./validar-aposta-esportes.component.css']
})
export class ValidarApostaEsportesComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() success = new EventEmitter();
    @Input() preAposta: any;
    preApostaItens = [];
    cotacoesVinheramDifentes = false;
    cotacoesMudaram = false;
    disabled = false;
    process = false;
    estimativaGanho;
    opcoes;
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private helper: HelperService,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.opcoes = this.paramsService.getOpcoes();

        this.createForm();
        this.preApostaItens = this.preAposta.itens;

        this.preApostaItens.forEach(item => {
            if (item.mensagem) {
                this.disabled = true;
            }

            if (item.cotacao_antiga != item.cotacao_atual) {
                this.cotacoesVinheramDifentes = true;
            }
        });

        this.form.patchValue(this.preAposta);

        this.form.get('valor').valueChanges
            .pipe(takeUntil(this.unsub$))
            .subscribe(valor => {
                if (isNumeric(valor)) {
                    this.calcularEstimativaGanho(valor);
                } else {
                    this.calcularEstimativaGanho(0);
                }
            });

        this.calcularEstimativaGanho();
    }

    ngOnDestroy() {
        this.cotacoesVinheramDifentes = false;
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
        let disabled = false;
        this.preAposta.itens.splice(i, 1);

        this.preAposta.cotacao = this.preAposta.itens
            .map(item => {
                if (item.mensagem) {
                    disabled = true;
                }

                return item.cotacao_atual;
            })
            .reduce((acumulador, valorAtual) => acumulador * valorAtual);

        this.disabled = disabled;

        this.calcularEstimativaGanho();
    }

    submit() {
        this.triggerProcess();
        this.cotacoesVinheramDifentes = false;
        this.cotacoesMudaram = false;

        const values = this.form.value;
        values.preaposta_id = this.preAposta.id;

        values.itens = this.preApostaItens.map(item => {
            return {
                jogo_event_id: item.jogo_api_id,
                jogo_id: item.jogo_fi,
                jogo_nome: item.jogo_nome,
                ao_vivo: item.ao_vivo,
                cotacao: {
                    chave: item.aposta_tipo.chave,
                    nome: item.odd_nome,
                    valor: item.cotacao_base
                }
            };
        });


        if (values.itens.length) {
            this.apostaEsportivaService
                .create(values)
                .pipe(takeUntil(this.unsub$))
                .subscribe(
                    result => {
                        this.deactivateProcess();
                        this.success.emit(result);
                    },
                    error => this.handleError(error)
                );
        } else {
            this.handleError('Nenhum jogo na aposta!');
        }
    }

    handleError(error) {
        this.deactivateProcess();

        if (typeof error === 'string') {
            this.messageService.error(error);
        } else {
            if (error.code === 17) {
                error.data.forEach(item => {
                    this.preApostaItens.forEach(i => {
                        if (item.jogo_api_id == i.jogo_event_id) {
                            i.cotacao_antiga = i.cotacao_atual;
                            i.cotacao_atual = this.helper.calcularCotacao(
                                item.valor, i.aposta_tipo.chave, i.jogo_event_id, i.jogo_favorito, i.ao_vivo
                            );
                            i.cotacao_base = item.valor;

                            this.cotacoesMudaram = true;
                        }
                    });
                });
            }
        }
    }

    deactivateProcess() {
        this.process = false;
    }

    triggerProcess() {
        this.process = true;
    }

    calcularEstimativaGanho(valor?) {
        if (valor === undefined) {
            valor = this.form.value.valor;
        }

        const estimativaGanho = valor * this.preAposta.cotacao;

        if (estimativaGanho < this.opcoes.valor_max_premio) {
            this.estimativaGanho = estimativaGanho;
        } else {
            this.estimativaGanho = this.opcoes.valor_max_premio;
        }
    }
}
