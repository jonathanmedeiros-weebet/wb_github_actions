import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessageService, ApostaEsportivaService } from '../../services';
import { ApostaEsportiva } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-consultar-aposta',
    templateUrl: 'consultar-aposta.component.html',
    styleUrls: ['./consultar-aposta.component.css']
})
export class ConsultarApostaComponent implements OnInit, OnDestroy {
    codigo;
    aposta: ApostaEsportiva;
    unsub$ = new Subject();

    constructor(
        private apostaEsportivaService: ApostaEsportivaService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    consultarAposta() {
        this.apostaEsportivaService.getAposta(this.codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                aposta => this.aposta = aposta,
                error => this.handleError(error)
            );
    }

    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
