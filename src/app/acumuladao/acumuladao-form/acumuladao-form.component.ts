import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AcumuladaoService, MessageService, AuthService } from './../../services';
import { Acumuladao } from './../../models';
import { ApostaAcumuladaoModalComponent } from './../../shared/layout/modals/aposta-acumuladao-modal/aposta-acumuladao-modal.component';
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
    encerrado = true;
    acumuladao = new Acumuladao();
    disabled = false;
    displayPreTicker = false;
    modalRef;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService,
        public modalService: NgbModal,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
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
    }

    submit() {
        let msg = '';
        let valid = true;
        const dados = {
            apostador: this.form.value.apostador,
            acumuladao_id: this.acumuladao.id,
            jogos: [],
        };

        this.acumuladao.jogos.forEach(j => {
            if ((j.time_a_resultado != null) && (j.time_b_resultado != null)) {
                dados.jogos.push({
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
                this.acumuladaoService.createAposta(dados)
                    .subscribe(
                        aposta => this.apostaSuccess(aposta),
                        error => this.handleError(error)
                    );
            } else {
                this.acumuladaoService.createPreAposta(dados)
                    .subscribe(
                        aposta => this.preApostaSucess(aposta),
                        error => this.handleError(error)
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

    apostaSuccess(aposta) {
        this.modalRef = this.modalService.open(ApostaAcumuladaoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
        this.modalRef.componentInstance.aposta = aposta;
        this.modalRef.componentInstance.showCancel = true;
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

    preApostaSucess(aposta) {
        this.modalRef = this.modalService.open(PreApostaModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
        this.modalRef.componentInstance.codigo = aposta.id;
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
