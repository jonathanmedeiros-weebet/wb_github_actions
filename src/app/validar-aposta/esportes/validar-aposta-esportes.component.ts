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
import { takeUntil } from 'rxjs/operators';
import {
    MessageService,
    ApostaEsportivaService
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
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.preApostaItens = this.preAposta.itens;

        this.preApostaItens.forEach(item => {
            if (item.cotacao_antiga != item.cotacao_atual) {
                this.cotacoesVinheramDifentes = true;
            }
        });
        this.form.patchValue(this.preAposta);
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
        this.preAposta.itens.splice(i, 1);

        this.preAposta.cotacao = this.preAposta.itens
            .map(item => item.cotacao)
            .reduce((acumulador, valorAtual) => acumulador * valorAtual);
    }

    submit() {
        this.disabledSubmit();
        this.cotacoesVinheramDifentes = false;
        this.cotacoesMudaram = false;

        const values = this.form.value;
        values.preaposta_id = this.preAposta.id;

        values.itens = this.preApostaItens.map(item => {
            return {
                jogo_id: item.jogo.id,
                jogo_nome: item.jogo.nome,
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
                        this.enableSubmit();
                        this.success.emit(result);
                    },
                    error => this.handleError(error)
                );
        } else {
            this.handleError('Nenhum jogo na aposta!');
        }
    }

    handleError(error) {
        this.enableSubmit();

        if (typeof error === 'string') {
            this.messageService.error(error);
        } else {
            if (error.code === 17) {
                error.data.forEach(item => {
                    this.preApostaItens.forEach(i => {
                        if (item.jogoId == i.jogo.id) {
                            i.cotacao_antiga = i.cotacao_atual;
                            i.cotacao_atual = item.valor;
                            i.cotacao_base = item.valor;

                            this.cotacoesMudaram = true;
                        }
                    });
                });
            }
        }
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }
}
