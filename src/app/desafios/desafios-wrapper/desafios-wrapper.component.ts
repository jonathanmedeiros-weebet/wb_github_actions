import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SidebarService, DesafioCategoriaService, MessageService } from '../../services';

@Component({
    selector: 'app-desafios-wrapper',
    templateUrl: './desafios-wrapper.component.html',
    styleUrls: ['./desafios-wrapper.component.css']
})
export class DesafiosWrapperComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();

    constructor(
        private desafioCategoriaService: DesafioCategoriaService,
        private sidebarService: SidebarService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                dados => {
                    if (dados.contexto !== 'desafio') {
                        this.getDesafioCategorias2Sidebar();
                    }
                }
            );
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    getDesafioCategorias2Sidebar() {
        this.desafioCategoriaService.getCategorias()
            .pipe(take(1))
            .subscribe(
                categorias => {
                    const dados = {
                        itens: categorias,
                        contexto: 'desafio'
                    };

                    this.sidebarService.changeItens(dados);
                },
                error => this.messageService.error(error)
            );
    }

}
