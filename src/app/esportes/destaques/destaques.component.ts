import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { UtilsService } from "../../shared/services/utils/utils.service";

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {
    @Output() regiaoSelecionada = new EventEmitter();
    regioesDestaque = null;
    exibindoRegiao = false;
    menuWidth;
    mobileScreen;

    constructor(
        private utilsService: UtilsService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;

        this.utilsService.getRegioesDestaque()
            .subscribe(
                res => {
                    if (res.length > 0) {
                        this.regioesDestaque = res;
                        this.cd.detectChanges();
                    }
                }
            );

        this.menuWidth = window.innerWidth - 10;
    }

    selecionarRegiao(siglaRegiao?) {
        if (this.exibindoRegiao) {
            this.regiaoSelecionada.emit();
            this.exibindoRegiao = false;
        } else {
            this.regiaoSelecionada.emit(siglaRegiao);
            this.exibindoRegiao = true;
        }
    }

    exibirDestaques() {
        let result = false

        if (this.mobileScreen && this.regioesDestaque && !this.exibindoRegiao) {
            result = true;
        }

        return result;
    }
}
