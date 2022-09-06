import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services';

@Component({
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.css']
})
export class TabelaComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.sidebarService.changeItens({contexto: 'cambista'});
  }

}
