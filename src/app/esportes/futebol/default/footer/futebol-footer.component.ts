import { Component, OnInit } from '@angular/core';

import { ParametrosLocais } from '../../../../shared/utils';

@Component({
    selector: 'app-futebol-footer',
    templateUrl: 'futebol-footer.component.html',
    styleUrls: ['futebol-footer.component.css']
})

export class FutebolFooterComponent implements OnInit {
    informativoRodape;

    constructor() { }

    ngOnInit() {
        this.informativoRodape = ParametrosLocais.getInformativoRodape();
    }
}
