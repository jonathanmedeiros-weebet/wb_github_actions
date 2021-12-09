import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';

@Component({
    selector: 'app-acumuladao-wrapper',
    templateUrl: './acumuladao-wrapper.component.html',
    styleUrls: ['./acumuladao-wrapper.component.css']
})
export class AcumuladaoWrapperComponent implements OnInit, OnDestroy {

    constructor(
        private menuFooterService: MenuFooterService
    ) {
    }

    ngOnInit() {
        this.menuFooterService.atualizarQuantidade(0);
        this.menuFooterService.setIsAcumuladao(true);

    }

    ngOnDestroy() {
        this.menuFooterService.setIsAcumuladao(false);
    }
}
