import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {UtilsService} from "../../shared/services/utils/utils.service";

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

    constructor(
        private router: Router,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
        this.utilsService.getRegioesDestaque()
            .subscribe(
                res => {
                    this.regioesDestaque = res;
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
}
