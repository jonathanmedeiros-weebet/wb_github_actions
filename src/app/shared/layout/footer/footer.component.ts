import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { config } from '../../config';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import { ResultadosModalComponent } from '../modals/resultados-modal/resultados-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { CartaoCadastroModalComponent, PesquisarCartaoModalComponent, RecargaCartaoModalComponent, SolicitarSaqueModalComponent } from '../modals';

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
    isMobile;
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
    esporteHabilitado: boolean;
    cartaoApostaHabilitado: boolean;
    isCliente;
    hasApk;
    linkTwitter;
    linkTelegram;
    linkTikTok;
    linkFacebook;
    linkInstagram;
    linkLinkedin;
    exibirLinkAfiliado = false;
    slug: string;
    sharedUrl: string;
    linkYoutube;

    constructor(
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.isAppMobile = this.authService.isAppMobile();
        this.BANCA_NOME = config.BANCA_NOME;
        this.hasApiPagamentos = !!this.paramsLocais.getOpcoes().available_payment_methods.length;
        this.hasApk = this.paramsLocais.getOpcoes().has_aplicativo;
        this.hasRegras = this.paramsLocais.getOpcoes().has_regras;
        this.hasTermosCondicoes = this.paramsLocais.getOpcoes().has_termos_condicoes;
        this.hasPoliticaPrivacidade = this.paramsLocais.getOpcoes().has_politica_privacidade;
        this.hasQuemSomos = this.paramsLocais.getOpcoes().has_quem_somos;
        this.hasJogoResponsavel = this.paramsLocais.getOpcoes().has_jogo_responsavel;
        this.hasPoliticaAml = this.paramsLocais.getOpcoes().has_politica_aml;
        this.rodape = this.paramsLocais.getOpcoes().rodape;
        this.esporteHabilitado = this.paramsLocais.getOpcoes().esporte;
        this.cartaoApostaHabilitado = this.paramsLocais.getOpcoes().cartao_aposta;
        this.exibirLinkAfiliado = this.paramsLocais.getOpcoes().exibir_link_afiliado;
        this.slug = config.SLUG;
        this.sharedUrl = config.SHARED_URL;

        this.linkTwitter = this.paramsLocais.getOpcoes().linkTwitter;
        this.linkTikTok = this.paramsLocais.getOpcoes().linkTikTok;
        this.linkTelegram = this.paramsLocais.getOpcoes().linkTelegram;
        this.linkFacebook = this.paramsLocais.getOpcoes().linkFacebook;
        this.linkInstagram = this.paramsLocais.getOpcoes().linkInstagram;
        this.linkLinkedin = this.paramsLocais.getOpcoes().linkLinkedin;
        this.linkYoutube = this.paramsLocais.getOpcoes().linkYoutube;

        this.linguagemSelecionada = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => this.linguagemSelecionada = res.lang);

        this.isMobile = window.innerWidth < 1025;

        this.authService.logado
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.authService.cliente
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );
    }

    temRedesSociais() {
        return this.linkTelegram || this.linkFacebook || this.linkTikTok || this.linkTwitter || this.linkLinkedin || this.linkInstagram;
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

    abrirConsultarCartao() {
        const modalConsultarCartao = this.modalService.open(PesquisarCartaoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
    }

    abrirSolicitarSaque() {
        const modalConsultarCartao = this.modalService.open(SolicitarSaqueModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
    }

    abrirRecargaCartao() {
        const modalConsultarCartao = this.modalService.open(RecargaCartaoModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
    }

    abrirCriarCartao() {
        const modalConsultarCartao = this.modalService.open(CartaoCadastroModalComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
        });
    }

    svgStyleGameTerapia() {
        if (this.isMobile) {
            return {
                width: '100px',
                fill: 'var(--foreground-header)',
            }
        }

        return {
            width: '150px',
            fill: 'var(--foreground-header)',
        }
    }

    svgStyleMaiorIdade() {
        if (this.isMobile) {
            return {
                width: '30px',
                fill: 'var(--foreground-header)',
                stroke: 'var(--foreground-header)',
            }
        }

        return {
            width: '45px',
            fill: 'var(--foreground-header)',
            stroke: 'var(--foreground-header)',
        }
    }
}
