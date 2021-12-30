import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegioesDestaqueService } from "../../shared/services/regioes-destaque.service";

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {
    @Output() regiaoSelecionada = new EventEmitter();
    regioesDestaque = null;
    exibindoRegiao = false;
    exibirDestaques = true;
    menuWidth;
    mobileScreen;

    constructor(
        private regioesDestaqueService: RegioesDestaqueService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;

        if (this.mobileScreen) {
            this.regioesDestaqueService.getRegioesDestaque()
                .subscribe(
                    regioesDestaque => {
                        if (regioesDestaque.length > 0) {
                            this.regioesDestaque = regioesDestaque;
                            this.cd.detectChanges();
                        }
                    }
                );

            this.menuWidth = window.innerWidth - 10;
        }

        this.regioesDestaqueService.exibirDestaques
            .subscribe(
                exibirDestaques => {
                    this.exibindoRegiao = false;
                    this.exibirDestaques = exibirDestaques;
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

    exibirRegioes() {
        let result = false

        if (this.mobileScreen && this.regioesDestaque && !this.exibindoRegiao) {
            result = true;
        }

        return result;
    }
}
