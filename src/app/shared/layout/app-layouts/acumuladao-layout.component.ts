import {Component, OnInit} from '@angular/core';
import {MenuFooterService} from '../../services/utils/menu-footer.service';
import {SidebarService} from '../../services/utils/sidebar.service';

@Component({
    selector: 'app-acumuladao-layout',
    templateUrl: './acumuladao-layout.component.html',
    styleUrls: ['./acumuladao-layout.component.css']
})
export class AcumuladaoLayoutComponent implements OnInit {

    constructor(
        private menuFooterService: MenuFooterService,
        private sidebarService: SidebarService
    ) {
    }

    ngOnInit() {
        this.menuFooterService.atualizarQuantidade(0);
        this.menuFooterService.setIsAcumuladao(true);
        this.sidebarService.changeItens({contexto: 'acumuladao'});
    }

}
