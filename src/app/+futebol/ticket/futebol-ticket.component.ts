import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import {
    MessageService, BilheteEsportivoService, HelperService,
    PrintService, ApostaEsportivaService
} from '../../services';
import { ItemBilheteEsportivo } from '../../models';

@Component({
    selector: 'app-futebol-ticket',
    templateUrl: 'futebol-ticket.component.html',
    styleUrls: ['futebol-ticket.component.css']
})
export class FutebolTicketComponent implements OnInit, OnDestroy {
    form: FormGroup;
    possibilidadeGanho = 0;
    sub: Subscription;

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private bilheteService: BilheteEsportivoService,
        private messageService: MessageService,
        private printService: PrintService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();

        this.sub = this.bilheteService.itensAtuais.subscribe(itens => {
            this.setItens(itens);
            this.calcularPossibilidadeGanho(this.form.value.valor);
        });

        this.form.get('valor').valueChanges.subscribe(valor => {
            this.calcularPossibilidadeGanho(valor);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    createForm() {
        this.form = this.fb.group({
            apostador: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            itens: this.fb.array([])
        });
    }

    get itens() {
        return this.form.get('itens') as FormArray;
    }

    setItens(itens: ItemBilheteEsportivo[]) {
        const controls = itens.map(item => this.fb.control(item));
        const formArray = this.fb.array(controls);
        this.form.setControl('itens', formArray);
    }

    removerItem(index) {
        this.itens.removeAt(index);
        this.bilheteService.atualizarItens(this.itens.value);
    }

    calcularPossibilidadeGanho(valor) {
        let cotacoes = 1;

        this.itens.value.forEach(item => {
            cotacoes = cotacoes * item.cotacao.valor;
        });

        this.possibilidadeGanho = valor * cotacoes;
    }

    onSubmit() {
        // const x = {
        //     id: 7,
        //     valor: '17',
        //     premio: 54.586999999999996,
        //     horario: '08/08/2018 as 16h42',
        //     apostador: 'thiago',
        //     itens: [
        //         {
        //             jogo: {
        //                 id: 75610950,
        //                 nome: 'GENERAL LAMADRID x PLATENSE',
        //                 time_a_nome: 'GENERAL LAMADRID',
        //                 time_b_nome: 'PLATENSE',
        //                 horario: '2018-08-08 21:15:00',
        //                 ao_vivo: false
        //             },
        //             campeonato: {
        //                 id: 438,
        //                 nome: 'ARGENTINA CUP'
        //             },
        //             cotacao: {
        //                 chave: 'casa_90',
        //                 nome: 'CASA (90)',
        //                 valor: 3.211
        //             }
        //         },
        //         {
        //             jogo: {
        //                 id: 75494823,
        //                 nome: `VELEZ SARSFIELD x NEWELL'S`,
        //                 time_a_nome: 'VELEZ SARSFIELD',
        //                 time_b_nome: `NEWELL'S`,
        //                 horario: '2018-08-08 21:15:00',
        //                 ao_vivo: false
        //             },
        //             campeonato: {
        //                 id: 438,
        //                 nome: 'ARGENTINA SUPERLIGA'
        //             },
        //             cotacao: {
        //                 chave: 'empate_90',
        //                 nome: 'EMPATE (90)',
        //                 valor: 3
        //             }
        //         }
        //     ]
        // };
        // this.printService.sportsTicket(x);

        if (this.itens.length) {
            if (this.form.valid) {
                this.apostaEsportivaService.create(this.form.value).subscribe(
                    result => this.success(result, 'imprimir'),
                    error => this.handleError(error)
                );
            } else {

            }
        } else {
            this.messageService.warning('Por favor, inclua um palpite.');
        }
    }


    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedSportsTicket(data.results);
        } else {
            this.printService.sportsTicket(data.results);
        }

        this.bilheteService.atualizarItens([]);
        this.form.reset();

        this.messageService.success('Aposta realizada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
