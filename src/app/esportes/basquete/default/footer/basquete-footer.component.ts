import { Component, OnInit } from '@angular/core';

import { ParametrosLocais } from '../../../../shared/utils';

@Component({
    selector: 'app-basquete-footer',
    templateUrl: 'basquete-footer.component.html',
    styleUrls: ['basquete-footer.component.css']
})

export class BasqueteFooterComponent implements OnInit {
    informativoRodape;

    constructor() { }

    ngOnInit() {
        this.informativoRodape = ParametrosLocais.getInformativoRodape();
    }
}
