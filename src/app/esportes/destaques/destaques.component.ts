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
    jogosDestaque = [];

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

        this.jogosDestaque = [
            {
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },{
                campeonato: 'Campeonato Brasileiro', horario: 'Hoje / 16:00',
                time1: { nome: 'São Paulo', escudo: 'https://cdn.wee.bet/img/times/s/3292.png' },
                time2: { nome: 'Itaquaquecetuba', escudo: 'https://cdn.wee.bet/img/times/s/1292.png' },
                odds: [ { nome: 'Casa', cotacao: '2.00' }, { nome: 'Empate', cotacao: '2.00' }, { nome: 'Fora', cotacao: '2.00' } ]
            },
        ];
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
}
