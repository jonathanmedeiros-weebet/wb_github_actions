import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from 'src/app/services';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.css']
})

export class FinanceiroComponent implements OnInit {
    loading = false;
    status = '';
    periodo = '';

    movimentacoes: [];

    constructor(
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
    ) { }

    ngOnInit(): void {
        this.sidebarService.changeItens({contexto: 'cambista'});
    }

    handleFiltrar() {

    }
}
