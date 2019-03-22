import { Component, OnInit } from '@angular/core';

import { ParametrosLocaisService } from '../../services';

@Component({
    selector: 'app-esportes-footer',
    templateUrl: 'esportes-footer.component.html',
    styleUrls: ['esportes-footer.component.css']
})

export class EsportesFooterComponent implements OnInit {
    informativoRodape;

    constructor(private paramsService: ParametrosLocaisService) { }

    ngOnInit() {
        this.informativoRodape = this.paramsService.getInformativoRodape();
    }
}
