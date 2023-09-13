import { Component, OnInit } from '@angular/core';

import { ClienteService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';

@Component({
  selector: 'app-indique-ganhe',
  templateUrl: './indique-ganhe.component.html',
  styleUrls: ['./indique-ganhe.component.css']
})
export class IndiqueGanheComponent implements OnInit {
    linkIndicacao;
    valorGanhoPorIndicacao;
    mobileScreen;

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private paramsLocaisService: ParametrosLocaisService,
        private sidebarService: SidebarService
    ) { }

    ngOnInit(): void {
        this.valorGanhoPorIndicacao = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_por_indicacao;
        this.mobileScreen = window.innerWidth <= 1024;

        this.clienteService.getLinkIndicacao()
            .subscribe(
                response => {
                    this.linkIndicacao = response.linkIndicacao
                },
                error => {
                    this.messageService.error(error);
                }
            );

        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        }
    }
}
