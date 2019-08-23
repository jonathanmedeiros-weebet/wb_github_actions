import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AcumuladaoService, MessageService } from './../../services';
import { Acumuladao } from './../../models';

import * as moment from 'moment';

@Component({
    selector: 'app-acumuladao-form',
    templateUrl: './acumuladao-form.component.html',
    styleUrls: ['./acumuladao-form.component.css']
})
export class AcumuladaoFormComponent implements OnInit {
    encerrado = false;
    acumuladao = new Acumuladao();
    disabled = false;
    displayPreTicker = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private acumuladaoService: AcumuladaoService,
        private messageService: MessageService
    ) { }

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
                                }
                            },
                            error => this.handleError(error)
                        );
                }
            }
        );
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    finalizar() {
        const msg = '';
        const valid = true;
        const aposta = {
            apostador: 'thiago',
            acumuladao_id: this.acumuladao.id,
            valor: this.acumuladao.valor,
            jogos: [],
        };

        this.acumuladao.jogos.forEach(j => {
            // if ((j.time_a_resultado != null) && (j.time_b_resultado != null)) {
            aposta.jogos.push({
                id: j.id,
                // time_a_resultado: j.time_a_resultado,
                // time_b_resultado: j.time_b_resultado
                time_a_resultado: Math.floor(Math.random() * 3),
                time_b_resultado: Math.floor(Math.random() * 6)
            });
            // } else {
            //     valid = false;
            //     msg = 'Por favor, preencha todos os placares';
            // }
        });

        if (valid) {
            console.log(aposta);
            this.acumuladaoService.createAposta(aposta)
                .subscribe(
                    () => {
                        this.messageService.success('Aposta Realizada com sucesso!');
                    },
                    error => this.handleError(error)
                );

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
}
