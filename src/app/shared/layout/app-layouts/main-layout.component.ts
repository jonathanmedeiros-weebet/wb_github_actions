import { Component, OnInit } from '@angular/core';

import { MessageService, ParametroService } from './../../../services';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private parametroService: ParametroService
    ) { }

    ngOnInit() {
        this.getParametros();

        setInterval(() => {
            this.getParametros();
        }, 600000);
    }

    getParametros() {
        this.parametroService.getParametros().subscribe(
            parametros => {
                localStorage.setItem('cotacoes_locais', JSON.stringify(parametros['cotacoes_local']));
                localStorage.setItem('campeonatos_bloqueados', JSON.stringify(parametros['campeonatos_bloqueados']));
                localStorage.setItem('tipos_aposta', JSON.stringify(parametros['tipos_aposta']));
                localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));
            },
            error => this.messageService.error(error)
        );
    }
}
