import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    AuthService,
    MessageService,
    PreApostaEsportivaService,
    ApostaEsportivaService,
    SorteioService,
    ApostaLoteriaService
} from '../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from '../shared/layout/base-form/base-form.component';
import { ApostaModalComponent, ApostaLoteriaModalComponent } from '../shared/layout/modals';

@Component({
    selector: 'app-validar-aposta',
    templateUrl: 'validar-aposta.component.html',
    styleUrls: ['./validar-aposta.component.css']
})
export class ValidarApostaComponent extends BaseFormComponent implements OnInit, OnDestroy {
    codigo;
    exibirPreAposta = false;
    preAposta: any;
    preApostaItens = [];
    disabled = false;
    sorteios = [];
    appMobile = false;
    modalRef;
    unsub$ = new Subject();

    constructor(
        private auth: AuthService,
        private apostaLoteriaService: ApostaLoteriaService,
        private apostaEsportivaService: ApostaEsportivaService,
        private preApostaService: PreApostaEsportivaService,
        private sorteioService: SorteioService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private elRef: ElementRef,
        private modalService: NgbModal
    ) {
        super();
    }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();

        this.sorteioService
            .getSorteios()
            .subscribe(sorteios => (this.sorteios = sorteios));

        this.createForm();
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

        if (this.preAposta.tipo === 'esportes') {
            this.preAposta.cotacao = this.preAposta.itens
                .map(item => item.cotacao)
                .reduce((acumulador, valorAtual) => acumulador * valorAtual);
        } else {
            this.preAposta.valor = this.preAposta.itens
                .map(item => item.valor)
                .reduce((acumulador, valorAtual) => acumulador * valorAtual);
        }
    }

    consultarAposta() {
        this.preApostaService
            .getPreAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                preAposta => {
                    this.exibirPreAposta = true;
                    this.preAposta = preAposta;
                    this.preApostaItens = preAposta.itens;
                    this.form.patchValue(preAposta);
                },
                error => this.handleError(error)
            );
    }

    submit() {
        this.disabledSubmit();

        const values = this.form.value;
        values.preaposta_id = this.preAposta.id;

        if (this.preAposta.tipo === 'esportes') {
            values.itens = this.preApostaItens.map(item => {
                return {
                    jogo_id: item.jogo.id,
                    jogo_nome: item.jogo.nome,
                    aoVivo: item.ao_vivo,
                    cotacao: {
                        chave: item.aposta_tipo.chave,
                        valor: item.cotacao
                    }
                };
            });

            if (values.itens.length) {
                this.apostaEsportivaService
                    .create(values)
                    .pipe(takeUntil(this.unsub$))
                    .subscribe(
                        result => this.success(result),
                        error => this.handleError(error)
                    );
            } else {
                this.handleError('Nenhum jogo na aposta!');
            }
        } else {
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
                        result => this.success(result),
                        error => this.handleError(error)
                    );
            } else {
                this.handleError('Nenhum palpite na aposta!');
            }
        }
    }

    success(aposta) {
        this.reboot();

        let modalComponent;
        if (aposta.tipo === 'esportes') {
            modalComponent = ApostaModalComponent;
        } else {
            modalComponent = ApostaLoteriaModalComponent;
        }

        this.modalRef = this.modalService.open(modalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        this.modalRef.componentInstance.aposta = aposta;
    }

    handleError(msg) {
        this.enableSubmit();
        this.messageService.error(msg);
    }

    reboot() {
        this.enableSubmit();
        this.exibirPreAposta = false;
        this.form.reset();
        this.codigo = '';
        this.preAposta = null;
        this.preApostaItens = [];

        this.goToTop('#default-content');
    }

    sorteioNome(sorteioId) {
        const sorteio = this.sorteios.find(s => s.id === sorteioId);
        return sorteio ? sorteio.nome : '';
    }

    goToTop(selector) {
        const content = this.elRef.nativeElement.querySelector(selector);
        content.scrollTop = 0;
    }

    disabledSubmit() {
        this.disabled = true;
    }

    enableSubmit() {
        this.disabled = false;
    }
}
