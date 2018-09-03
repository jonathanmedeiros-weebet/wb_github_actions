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
                console.log('main layout', parametros);

                localStorage.setItem('cotacoes-locais', JSON.stringify(parametros['cotacoes-local']));
                localStorage.setItem('campeonatos-bloqueados', JSON.stringify(parametros['campeonatos-bloqueados']));
                localStorage.setItem('tipos-aposta', JSON.stringify(parametros['tipos-aposta']));
                localStorage.setItem('opcoes', JSON.stringify(parametros['opcoes']));
            },
            error => this.messageService.error(error)
        );
    }
}
