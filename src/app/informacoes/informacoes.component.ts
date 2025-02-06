import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MenuFooterService, PaginaService, ParametrosLocaisService} from './../services';
import {Pagina} from './../models';
import {TranslateService} from '@ngx-translate/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
    templateUrl: './informacoes.component.html',
    styleUrls: ['informacoes.component.css'],
})
export class InformacoesComponent implements OnInit, OnDestroy {
    @ViewChild('content') content: ElementRef;
    showLoadingIndicator = true;
    pagina = new Pagina();
    conteudo;
    unsub$ = new Subject();
    mobileScreen;
    tituloPagina = '';
    private linguagemSelecionada: string = 'pt';
    private paginas;
    hasRegras = false;
    hasTermosCondicoes = false;
    hasPoliticaPrivacidade = false;
    hasQuemSomos = false;
    hasJogoResponsavel = false;
    hasPoliticaAml = false;
    hasAfiliados = false;

    constructor(
        private route: ActivatedRoute,
        private paginaService: PaginaService,
        private menuFooterService: MenuFooterService,
        private renderer: Renderer2,
        private el: ElementRef,
        private translate: TranslateService,
        private cd: ChangeDetectorRef,
        private paramsLocais: ParametrosLocaisService
    ) {
    }

    ngOnInit() {
        this.hasRegras = this.paramsLocais.getOpcoes().has_regras;
        this.hasTermosCondicoes = this.paramsLocais.getOpcoes().has_termos_condicoes;
        this.hasPoliticaPrivacidade = this.paramsLocais.getOpcoes().has_politica_privacidade;
        this.hasQuemSomos = this.paramsLocais.getOpcoes().has_quem_somos;
        this.hasJogoResponsavel = this.paramsLocais.getOpcoes().has_jogo_responsavel;
        this.hasPoliticaAml = this.paramsLocais.getOpcoes().has_politica_aml;
        this.hasAfiliados = Boolean(this.paramsLocais.getOpcoes().has_afiliados && this.paramsLocais.getOpcoes().exibir_link_afiliado);
        this.mobileScreen = window.innerWidth <= 1024;
        this.linguagemSelecionada = this.translate.currentLang;

        this.route.data.pipe(takeUntil(this.unsub$)).subscribe((data) => {
            const pageDataDefault = {conteudo: ''};

            this.tituloPagina = this.translate.instant('paginas.' + data.pagina);
            this.translate.onLangChange.subscribe((change) => {
                this.tituloPagina = this.translate.instant(`paginas.${data.pagina}`)
                this.pagina = this.paginas[change.lang.toUpperCase()] || pageDataDefault;
            });

            this.paginaService
                .getPaginaPorChave(data.pagina)
                .subscribe((paginas) => {
                    this.paginas = paginas;
                    this.showLoadingIndicator = false;
                    this.pagina = this.paginas[this.linguagemSelecionada.toUpperCase()] || pageDataDefault;
                });
        });

        this.menuFooterService.setIsPagina(true);
        this.definirAltura();
    }

    definirAltura() {
        const altura = window.innerHeight - 105;
        const wrapStickyEl = this.el.nativeElement.querySelector('.wrap-stick');
        this.renderer.setStyle(wrapStickyEl, 'min-height', `${altura}px`);
    }

    savePDF() {
        const content = this.content.nativeElement.innerHTML.replace(/(style="[^\"]*")/gm, '');
        const html = htmlToPdfmake(`<h2>${this.tituloPagina}</h2>` + content);

        const documentDefinition = {content: html};
        pdfMake.createPdf(documentDefinition).download(this.pagina.chave + '.pdf');
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);
    }
}
