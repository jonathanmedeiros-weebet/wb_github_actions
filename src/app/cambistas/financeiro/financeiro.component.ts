import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})

export class FinanceiroComponent implements OnInit {
    loading = false;
    status = "";
    periodo = "";

    movimentacoes: [];

    constructor(
        private sidebarService: SidebarService,
    ) { }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});
    }

    handleFiltrar() {

    }
}
