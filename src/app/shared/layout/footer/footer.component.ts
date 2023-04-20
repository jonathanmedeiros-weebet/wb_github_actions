import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { config } from '../../config';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import { ResultadosModalComponent } from '../modals/resultados-modal/resultados-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() container;
    BANCA_NOME = '';
    LOGO = config.LOGO;
    isAppMobile;
    trevoOne = false;
    hasApiPagamentos = false;
    hasRegras = false;
    hasTermosCondicoes = false;
    hasPoliticaPrivacidade = false;
    hasQuemSomos = false;
    hasJogoResponsavel = false;
    hasPoliticaAml = false;
    appUrl = 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/app/app.apk?v=' + (new Date()).getTime();
    rodape;
    unsub$ = new Subject();
    isLoggedIn = false;
    linguagemSelecionada;

    constructor(
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.isAppMobile = this.authService.isAppMobile();
        this.BANCA_NOME = config.BANCA_NOME;
        this.hasApiPagamentos = this.paramsLocais.getOpcoes().api_pagamentos;
        this.hasRegras = this.paramsLocais.getOpcoes().has_regras;
        this.hasTermosCondicoes = this.paramsLocais.getOpcoes().has_termos_condicoes;
        this.hasPoliticaPrivacidade = this.paramsLocais.getOpcoes().has_politica_privacidade;
        this.hasQuemSomos = this.paramsLocais.getOpcoes().has_quem_somos;
        this.hasJogoResponsavel = this.paramsLocais.getOpcoes().has_jogo_responsavel;
        this.hasPoliticaAml = this.paramsLocais.getOpcoes().has_politica_aml;
        this.rodape = this.paramsLocais.getOpcoes().rodape;

        this.linguagemSelecionada = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => this.linguagemSelecionada = res.lang);

        if (location.host.search(/trevoone/) >= 0) {
            this.trevoOne = true;
        }

        this.authService.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );
    }

    abrirResultados() {
        this.modalService.open(ResultadosModalComponent, {
            centered: true,
            size: 'xl',
        });
    }

    alterarLinguagem(linguagem) {
        localStorage.setItem('linguagem', linguagem);
        this.linguagemSelecionada = linguagem;
        this.translate.use(linguagem);
    }
}
