import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JogoService } from 'src/app/services';
import { RegioesDestaqueService } from "../../shared/services/regioes-destaque.service";

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {
    @Output() regiaoSelecionada = new EventEmitter();
    @Input() jogosDestaque = [];
    regioesDestaque = null;
    exibindoRegiao = false;
    exibirDestaques = false;
    menuWidth;
    mobileScreen;

    constructor(
        private regioesDestaqueService: RegioesDestaqueService,
        private jogoService: JogoService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024 ? true : false;
    }

    selecionarRegiao(regiao?) {
        if (this.exibindoRegiao) {
            this.regiaoSelecionada.emit();
            this.exibindoRegiao = false;
        } else {
            this.regiaoSelecionada.emit(regiao);
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

    // maisCotacoes(jogoId) {
    //     this.jogoIdAtual = jogoId;
    //     this.jogoSelecionadoId.emit(jogoId);
    //     this.exibirMaisCotacoes.emit(true);
    // }
}
