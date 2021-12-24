import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RegioesDestaqueService} from "../../shared/services/regioes-destaque.service";

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
    permitirDestaques = true;

    constructor(
        private regioesDestaqueService: RegioesDestaqueService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;

        if (this.mobileScreen) {
            this.regioesDestaqueService.getRegioesDestaque()
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

        this.regioesDestaqueService.permitirDestaques
            .subscribe(
                res  => {
                    this.permitirDestaques = res;
                    if (!res) {
                        this.selecionarRegiao();
                        this.exibindoRegiao = false;
                    }
                }
            );
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
