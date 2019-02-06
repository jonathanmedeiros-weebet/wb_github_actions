import { Component, OnInit } from '@angular/core';

import { ParametrosLocaisService } from '../../../../services';

@Component({
    selector: 'app-basquete-footer',
    templateUrl: 'basquete-footer.component.html',
    styleUrls: ['basquete-footer.component.css']
})

export class BasqueteFooterComponent implements OnInit {
    informativoRodape;

    constructor(private paramsService: ParametrosLocaisService) { }

    ngOnInit() {
        this.informativoRodape = this.paramsService.getInformativoRodape();
    }
}
