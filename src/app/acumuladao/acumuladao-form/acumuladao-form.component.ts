import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    AcumuladaoService, MessageService,
    AuthService, ParametrosLocaisService
} from './../../services';
import { Acumuladao } from './../../models';
import { ApostaModalComponent } from './../../shared/layout/modals';
import { PreApostaModalComponent } from './../../shared/layout/modals/pre-aposta-modal/pre-aposta-modal.component';
import { BaseFormComponent } from '../../shared/layout/base-form/base-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
    selector: 'app-acumuladao-form',
    templateUrl: './acumuladao-form.component.html',
    styleUrls: ['./acumuladao-form.component.css']
})
export class AcumuladaoFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('apostaDeslogadoModal', { static: true }) apostaDeslogadoModal;
    showLoadingIndicator = true;
    encerrado = true;
    acumuladao = new Acumuladao();
    disabled = false;
    displayPreTicker = false;
    modalRef;
    btnText = 'Pré-Aposta';
    tipoApostaDeslogado = 'preaposta';
    cartaoApostaForm: FormGroup;
    opcoes;
    dados;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
        public modalService: NgbModal,
        private fb: FormBuilder,
        private paramsService: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.opcoes = this.paramsService.getOpcoes();

        this.route.params.subscribe(
            params => {
                if (params['id']) {
                    const id = +params['id'];
                    this.acumuladaoService.getAcumuladao(id)
                        .subscribe(
                            acumuladao => {
                                this.acumuladao = acumuladao;

                                if (moment().isAfter(acumuladao.data_encerramento)) {
                                    this.encerrado = true;
                                } else {
                                    this.encerrado = false;
                                }

                                this.showLoadingIndicator = false;
                            },
                            error => this.handleError(error)
                        );
                }
            }
        );

        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', Validators.required]
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

    submit() {
        let msg = '';
        let valid = true;
        this.dados = {
            apostador: this.form.value.apostador,
            acumuladao_id: this.acumuladao.id,
            jogos: [],
        };

        this.acumuladao.jogos.forEach(j => {
            if ((j.time_a_resultado != null) && (j.time_b_resultado != null)) {
                this.dados.jogos.push({
                    id: j.id,
                    time_a_resultado: j.time_a_resultado,
                    time_b_resultado: j.time_b_resultado
                });
            } else {
                valid = false;
                msg = 'Por favor, preencha todos os placares';
            }
        });

        if (valid) {
            if (this.auth.isLoggedIn()) {
                this.finalizarAposta();
            } else {
                const cartaoChave = localStorage.getItem('cartao_chave');
                if (cartaoChave) {
                    this.cartaoApostaForm.patchValue({
                        chave: cartaoChave,
                        manter_cartao: true
                    });
                }

                this.modalRef = this.modalService.open(
                    this.apostaDeslogadoModal,
                    {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
                    }
                );

                this.modalRef.result
                    .then(
                        result => { },
                        reason => { }
                    );
            }
        } else {
            this.messageService.error(msg);
        }
    }

    back() {
        this.router.navigate(['/acumuladao/listagem']);
    }

    openCupom() {
        this.displayPreTicker = true;
    }

    closeCupom() {
        this.displayPreTicker = false;
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
        if (this.tipoApostaDeslogado === 'preaposta') {
            this.acumuladaoService.createPreAposta(this.dados)
                .subscribe(
                    aposta => this.success(aposta, true),
                    error => this.handleError(error)
                );
        } else {
            if (this.cartaoApostaForm.valid) {
                const cartaoValues = this.cartaoApostaForm.value;

                if (cartaoValues.manter_cartao) {
                    localStorage.setItem('cartao_chave', cartaoValues.chave);
                } else {
                    localStorage.removeItem('cartao_chave');
                }

                delete cartaoValues.manter_cartao;

                this.dados = Object.assign(this.dados, { cartao: cartaoValues });
                this.finalizarAposta();
            }
        }
    }

    finalizarAposta() {
        this.acumuladaoService.createAposta(this.dados)
            .subscribe(
                aposta => this.success(aposta),
                error => this.handleError(error)
            );
    }

    success(aposta, preAposta?) {
        if (this.modalRef) {
            this.modalRef.close();
        }

        let modal;
        if (preAposta) {
            modal = PreApostaModalComponent;
        } else {
            modal = ApostaModalComponent;
        }

        this.modalRef = this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });

        if (preAposta) {
            this.modalRef.componentInstance.codigo = aposta.id;
        } else {
            this.modalRef.componentInstance.aposta = aposta;
            this.modalRef.componentInstance.showCancel = true;
        }

        this.modalRef.result.then(
            (result) => { },
            (reason) => { }
        );

        this.form.reset();
        this.acumuladao.jogos.forEach(j => {
            j.time_a_resultado = null;
            j.time_b_resultado = null;
        });
    }

    handleError(msg: string) {
        this.messageService.error(msg);
    }
}
