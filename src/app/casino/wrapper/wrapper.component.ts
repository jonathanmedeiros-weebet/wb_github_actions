import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {CasinoApiService} from 'src/app/shared/services/casino/casino-api.service';
import {SidebarService} from '../../shared/services/utils/sidebar.service';
import {MenuFooterService} from '../../services';

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.css']
})
export class CasinoWrapperComponent implements OnInit, OnDestroy {

    @Input() showLoadingIndicator;

    constructor(
        private sideBarService: SidebarService,
        private menuFooterService: MenuFooterService,
    ) {}
    ngOnInit(): void {
        this.sideBarService.changeItens({
            contexto: 'casino',
            dados: {}
        });
        this.menuFooterService.setIsPagina(true);

    }
    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

}
