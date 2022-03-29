import { Component, OnInit } from '@angular/core';
import { CasinoApiService } from 'src/app/shared/services/casino/casino-api.service';
import {SidebarService} from '../../shared/services/utils/sidebar.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class CasinoWrapperComponent implements OnInit {

  constructor( private sideBarService: SidebarService ) { }

  ngOnInit(): void {
      this.sideBarService.changeItens({
          contexto:'casino',
          dados:{}

      })

  }

}
