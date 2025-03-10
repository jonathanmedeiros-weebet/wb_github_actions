import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { config } from '../../config';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';
import { ResultadosModalComponent } from '../modals/resultados-modal/resultados-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { CartaoCadastroModalComponent, PesquisarCartaoModalComponent, RecargaCartaoModalComponent, SolicitarSaqueModalComponent } from '../modals';
import { pwaInstallHandler } from 'pwa-install-handler';
import { ActivatedRoute, Router } from '@angular/router';

declare let anj_cd823ed6_bffb_4764_9e1b_05566f369c8c: any;

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {
    @Input() container;
    @ViewChild('lineClamp') contentElement!: ElementRef;
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
    isToTopBtnVisible;
    displayPwaInstallButton = false;
    hasCuracao = false;
    hasAnjouan = false;
    hasBodo = false;
    hasLoterj = false;
    hasCuracaoTemporary = false;
    hasLotep = false
    hasLicence = false
    seeMoreElement : HTMLElement;
    seeLess = false;
    fullPage = true;
    computedStyle;
    licences = [];
    allowDownloadCustomerApp;

    constructor(
        private authService: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private modalService: NgbModal,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        pwaInstallHandler.addListener((canInstall) => this.displayPwaInstallButton = canInstall);

        this.isAppMobile = this.authService.isAppMobile();
        this.BANCA_NOME = config.BANCA_NOME;
        this.hasApiPagamentos = Boolean(this.paramsLocais.getOpcoes().available_payment_methods.length);
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
        this.sharedUrl = Boolean(this.paramsLocais.sharedURL()?.trim()) ? this.paramsLocais.sharedURL() : config.SLUG;
        this.linkTwitter = this.paramsLocais.getOpcoes().linkTwitter;
        this.linkTikTok = this.paramsLocais.getOpcoes().linkTikTok;
        this.linkTelegram = this.paramsLocais.getOpcoes().linkTelegram;
        this.linkFacebook = this.paramsLocais.getOpcoes().linkFacebook;
        this.linkInstagram = this.paramsLocais.getOpcoes().linkInstagram;
        this.linkLinkedin = this.paramsLocais.getOpcoes().linkLinkedin;
        this.linkYoutube = this.paramsLocais.getOpcoes().linkYoutube;

        this.hasCuracao = this.paramsLocais.getOpcoes().enable_licence_curacao;
        this.hasCuracaoTemporary = this.paramsLocais.getOpcoes().enable_licence_curacao_temporary;
        this.hasAnjouan = this.paramsLocais.getOpcoes().enable_licence_anjouan;
        this.hasBodo = this.paramsLocais.getOpcoes().enable_licence_bodo;
        this.hasLoterj = this.paramsLocais.getOpcoes().enable_licence_loterj;
        this.hasLotep = this.paramsLocais.getOpcoes().enable_licence_lotep;

        this.allowDownloadCustomerApp = this.paramsLocais.getOpcoes().allow_download_customer_app;

        this.loadLicences();

        this.hasLicence = this.licences.length > 0;

        this.linguagemSelecionada = this.translate.currentLang;
        this.translate.onLangChange.subscribe(res => {
            this.linguagemSelecionada = res.lang;
            this.rodape = this.paramsLocais.getOpcoes()[`rodape_${res.lang}`];
        });

        this.rodape = this.paramsLocais.getOpcoes()[`rodape_${this.linguagemSelecionada}`];

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

    ngAfterViewInit() {
        let appendReclameAqui = true;
        let reclameAquiDataId = '';

        switch (this.slug) {
            case 'zilionz.com':
                anj_cd823ed6_bffb_4764_9e1b_05566f369c8c.init();
                appendReclameAqui = false;
                break;
            case 'saqbet.tv':
                reclameAquiDataId = 'eFVwSWdfU2FSRm42dmZOLTpzYXFiZXQtdHY=';
                break;
            default:
                appendReclameAqui = false;
        }

        if (appendReclameAqui) {
            this.appendReclameAqui(reclameAquiDataId);
        }

        if(this.container) {
            this.container.addEventListener('scroll', this.onScroll.bind(this));
        }

        const observer = new MutationObserver(() => {
            const bilheteContainer = document.querySelector('.bilhete-container') as HTMLElement;
            if (bilheteContainer && !this.isMobile) {
                const toTopElement = document.querySelector('.toTop') as HTMLElement;
                if (toTopElement) {
                    toTopElement.style.right = `calc(20px + ${bilheteContainer.clientWidth}px)`;
                }
            }
            if (bilheteContainer) {
                this.fullPage = false;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    onScroll() {
        const target = this.container;
        this.isToTopBtnVisible = target.scrollTop > 50;
    }

    scrollToTop() {
        this.container.scrollTo({ top: 0, behavior: 'smooth' });
    }

    appendReclameAqui(dataId: string) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'ra-embed-verified-seal';
        script.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
        script.setAttribute('data-id', dataId);
        script.setAttribute('data-target', 'ra-verified-seal');
        script.setAttribute('data-model', '2');
        document.body.appendChild(script);
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
        return {
            width: '33px',
            height: '33px',
            fill: 'var(--foreground-header)',
            stroke: 'var(--foreground-header)',
        }
    }

    public getLanguageIconClass() {
        let cssClass = 'flag-icon-';
        switch (this.linguagemSelecionada) {
            case 'pt':
                cssClass += 'br';
                break;
            case 'en':
                cssClass += 'us';
                break;
            case 'es':
                cssClass += 'es';
                break;
            default:
                cssClass += 'br';
        }

        return cssClass;
    }

    installPwa() {
        pwaInstallHandler.install();
    }

    get displayAgentApp(): boolean {
        const hasApk = this.paramsLocais.getOpcoes().has_aplicativo;
        const isAppMobile = this.isAppMobile;
        const agentMode = this.paramsLocais.getOpcoes().modo_cambista;

        return hasApk && !isAppMobile && agentMode;
    }

    removeOverflow(element: HTMLElement): void {
        if (element.clientHeight < element.scrollHeight) {
            element.classList.remove('custom-lineclamp');
            this.seeLess = true;
        } else {
            element.classList.add('custom-lineclamp');
            this.seeLess = false;
        }
      }

    hasOverflow(element: HTMLElement): boolean {
        if (element) {
          return element.scrollHeight > element.clientHeight;
        }
      }

    loadLicences(){
        if (this.hasAnjouan) {
            this.licences.push('anjouan');
        }
        if (this.hasBodo) {
            this.licences.push('bodo');
        }
        if (this.hasCuracao) {
            this.licences.push('curacao');
        }
        if (this.hasCuracaoTemporary) {
            this.licences.push('curacao-temporary');
        }
        if (this.hasLoterj) {
            this.licences.push('loterj');
        }
        if (this.hasLotep) {
            this.licences.push('lotep');
        }
    }

}
