import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {Subject} from 'rxjs';
import {CampeonatoService} from '../../shared/services/aposta-esportiva/campeonato.service';

@Component({
    selector: 'app-destaques',
    templateUrl: './destaques.component.html',
    styleUrls: ['./destaques.component.css']
})
export class DestaquesComponent implements OnInit {
    @Input() campeonatosDestaques;
    campeonatoSelecionado = false;
    unsub$ = new Subject();

    constructor(
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private campeonatoService: CampeonatoService
    ) {
    }

    ngOnInit() {
        this.getCampeonatosDestaques();
    }

    getCampeonatosDestaques() {
        const campeonatosBloqueados = this.paramsService.getCampeonatosBloqueados();
        const opcoes = this.paramsService.getOpcoes();
        const params = {
            'sport_id': 1,
            'campeonatos_bloqueados': campeonatosBloqueados,
            'campeonatos': this.paramsService.getCampeonatosPrincipais(),
            'data_final': opcoes.data_limite_tabela,
        };

        this.campeonatoService.getCampeonatos(params)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                campeonatosDestaque => {
                    console.log(campeonatosDestaque);
                    this.campeonatosDestaques = campeonatosDestaque;
                }
            );
    }

    goTo(url, queryParams) {
        this.campeonatoSelecionado = true;
        this.router.navigate([url], { queryParams });
    }

    back() {
        this.campeonatoSelecionado = false;
        this.router.navigate(['/esportes/futebol/jogos']);
    }

    selecionarCampeonato(camp) {
        console.log('');
    }

}
