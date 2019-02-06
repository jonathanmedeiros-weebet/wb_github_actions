import { Component, OnInit } from '@angular/core';

import { ParametrosLocaisService } from '../../../../services';

@Component({
    selector: 'app-futebol-footer',
    templateUrl: 'futebol-footer.component.html',
    styleUrls: ['futebol-footer.component.css']
})

export class FutebolFooterComponent implements OnInit {
    informativoRodape;

    constructor(private paramsService: ParametrosLocaisService) { }

    ngOnInit() {
        this.informativoRodape = this.paramsService.getInformativoRodape();
    }
}
