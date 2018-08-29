import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessageService, ApostaEsportivaService, PrintService, HelperService } from '../services';
import { BilheteEsportivo, PreApostaEsportiva } from '../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-validar-aposta',
    templateUrl: 'validar-aposta.component.html',
    styleUrls: ['./validar-aposta.component.css']
})
export class ValidarApostaComponent implements OnInit, OnDestroy {
    codigo;
    preAposta: PreApostaEsportiva;
    bilhete: BilheteEsportivo = new BilheteEsportivo();
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService,
        private printService: PrintService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    consultarAposta() {
        this.apostaEsportivaService.getPreAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                preAposta => this.preAposta = preAposta,
                error => this.handleError(error)
            );
    }

    validarAposta() {
        this.bilhete.apostador = this.preAposta.apostador;
        this.bilhete.valor = this.preAposta.valor;

        const itens = [];
        this.preAposta.itens.forEach(item => {
            itens.push({
                jogo_id: item.jogo.id,
                jogo_nome: item.jogo.nome,
                ao_vivo: item.ao_vivo,
                cotacao: {
                    chave: item.aposta_tipo.chave,
                    valor: item.cotacao
                }
            });
        });
        this.bilhete.itens = itens;

        this.apostaEsportivaService.create(this.bilhete)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                result => this.success(result, 'imprimir'),
                error => this.handleError(error)
            );
    }

    success(data, action) {
        if (action === 'compartilhar') {
            HelperService.sharedSportsTicket(data.results);
        } else {
            this.printService.sportsTicket(data.results);
        }

        this.messageService.success('Aposta validada!');
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
