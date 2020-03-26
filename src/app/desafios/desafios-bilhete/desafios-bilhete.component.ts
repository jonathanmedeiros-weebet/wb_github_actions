import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import {
    ParametrosLocaisService, MessageService, AuthService, DesafioBilheteService
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';

@Component({
    selector: 'app-desafios-bilhete',
    templateUrl: './desafios-bilhete.component.html',
    styleUrls: ['./desafios-bilhete.component.css']
})
export class DesafiosBilheteComponent extends BaseFormComponent implements OnInit {
    @ViewChild('apostaDeslogadoModal', { static: true }) apostaDeslogadoModal;
    mudancas = false;
    modalRef;
    possibilidadeGanho = 0;
    opcoes;
    apostaMinima;
    displayPreTicker = false;
    disabled = false;
    isLoggedIn;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: FormGroup;
    apostaAoVivo = false;
    delay = 20;
    cotacoesAlteradas = [];
    refreshIntervalId;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef,
        private fb: FormBuilder,
        private bilheteService: DesafioBilheteService,
        private paramsService: ParametrosLocaisService,
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.definirAltura();
        this.subcribeItens();
    }

    definirAltura() {
        const altura = window.innerHeight - 69;
        const preBilheteEl = this.el.nativeElement.querySelector('.pre-bilhete');
        this.renderer.setStyle(preBilheteEl, 'height', `${altura}px`);
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', [Validators.required]],
            valor: [0, [Validators.required, Validators.min(this.apostaMinima)]],
            itens: this.fb.array([])
        });

        this.cartaoApostaForm = this.fb.group({
            chave: [null, Validators.required],
            pin: [null, Validators.compose([
                Validators.required,
                Validators.minLength(3),
            ])],
            manter_cartao: [null]
        });
    }

    subcribeItens() {
        this.bilheteService.itensAtuais
            .pipe(takeUntil(this.unsub$))
            .subscribe(result => {
                this.setItens(result);
                // this.calcularPossibilidadeGanho(this.form.value.valor);
            });
    }

    definirValor(valor) {
        this.form.patchValue({ 'valor': valor });
    }

    get itens() {
        return this.form.get('itens') as FormArray;
    }

    setItens(itens: any[]) {
        const controls = itens.map(item => this.fb.control(item));
        const formArray = this.fb.array(controls);
        this.form.setControl('itens', formArray);
    }

    removerItem(index) {
    }

    calcularPossibilidadeGanho(valor) {
    }

    submit() {
    }

    apostaSuccess(aposta) {
    }

    preApostaSuccess(id) {
    }

    handleError(error) {
        this.enableSubmit();
        this.messageService.error(error);
    }

    openCupom() {
        this.displayPreTicker = true;
    }

    closeCupom() {
        this.displayPreTicker = false;
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }

    salvarAposta(dados) {

    }

    trocarTipoApostaDeslogado(tipo) {
        this.tipoApostaDeslogado = tipo;
        if (tipo === 'preaposta') {
            this.btnText = 'Pré-Aposta';
        } else {
            this.btnText = 'Aposta';
        }
    }

    finalizarApostaDeslogado() {
    }
}
