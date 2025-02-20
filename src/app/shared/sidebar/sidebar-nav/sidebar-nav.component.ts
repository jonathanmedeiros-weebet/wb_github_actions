import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/utils/sidebar.service';

import * as random from 'lodash.random';
import { SupresinhaService } from '../../services/utils/surpresinha.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseFormComponent } from '../../layout/base-form/base-form.component';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApostaService } from '../../services/aposta.service';
import { MessageService } from '../../services/utils/message.service';
import {
    ApostaModalComponent,
    CartaoCadastroModalComponent,
    PesquisarCartaoModalComponent,
    RecargaCartaoModalComponent,
    SolicitarSaqueModalComponent,
    ValidatePhoneModalComponent
} from '../../layout/modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth/auth.service';
import { ParametrosLocaisService } from '../../services/parametros-locais.service';
import { SportIdService } from 'src/app/services';
import { AccountVerificationService } from '../../services/account-verification.service';

@Component({
    selector: 'app-sidebar-nav',
    templateUrl: './sidebar-nav.component.html',
    styleUrls: ['./sidebar-nav.component.css']
})
export class SidebarNavComponent extends BaseFormComponent implements OnInit {
    @Input() height;
    @Input() collapsed = false;
    contexto;
    esporte = '';
    regiaoOpen;
    itens: any[];
    unsub$ = new Subject();
    ligasPopulares;
    isNotCambista = true;
    isLogado = false;
    whatsapp;
    cartaoApostaHabilitado;
    enabledBettorPix = false;
    modoCambista = true;
    indiqueGanheHabilitado = false;
    cashbackEnabled = false;
    permitirQualquerChavePix = false;
    allowAgentChangePassword = false;
    desafioNome: string;

    subCartao = false;
    subPerfil = false;
    subPromocoes = false;
    subTransacoes = false;

    public isMandatoryPhoneValidation = false;
    public userPhoneValidated = false;

    footballId: Number;
    boxingId: Number;
    volleyballId: Number;
    tennisId: Number;
    basketballId: Number;
    americanFootballId: Number;
    tableTennisId: Number;
    futsalId: Number;
    iceHockeyId: Number;
    eSportsId: Number;

    iconesGenericos = {
        'basquete': 'wbicon icon-basquete',
        'volei': 'wbicon icon-volei',
        'tenis': 'wbicon icon-tenis',
        'combate': 'wbicon icon-luta',
        'futsal': 'wbicon icon-futsal',
        'futebol-americano': 'wbicon icon-futebol-americano',
        'esports': 'wbicon icon-e-sports',
        'hoquei-gelo': 'wbicon icon-hoquei-no-gelo',
    };

    public accountVerified: boolean = false;

    constructor(
        private router: Router,
        private fb: UntypedFormBuilder,
        private apostaService: ApostaService,
        private sidebarService: SidebarService,
        private supresinhaService: SupresinhaService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService,
        private sportIdService: SportIdService,
        private accountVerificationService: AccountVerificationService
    ) {
        super();

        this.footballId = this.sportIdService.footballId;
        this.boxingId = this.sportIdService.boxingId;
        this.volleyballId = this.sportIdService.volleyballId;
        this.tennisId = this.sportIdService.tennisId;
        this.basketballId = this.sportIdService.basketballId;
        this.americanFootballId = this.sportIdService.americanFootballId;
        this.tableTennisId = this.sportIdService.tableTennisId;
        this.futsalId = this.sportIdService.futsalId;
        this.iceHockeyId = this.sportIdService.iceHockeyId;
        this.eSportsId = this.sportIdService.eSportsId;
    }

    get accountVerificationPending(): boolean {
        return this.isNotCambista && !this.accountVerified;
    }

    ngOnInit() {
        this.cartaoApostaHabilitado = this.paramsLocais.getOpcoes().cartao_aposta;
        this.allowAgentChangePassword = this.paramsLocais.getOpcoes().permitir_alterar_senha;
        this.enabledBettorPix = Boolean(this.paramsLocais.getOpcoes().payment_methods_available_for_bettors.length);
        this.modoCambista = this.paramsLocais.getOpcoes().modo_cambista;
        this.indiqueGanheHabilitado = this.paramsLocais.indiqueGanheHabilitado();
        this.cashbackEnabled = this.paramsLocais.cashbackEnabled();
        this.permitirQualquerChavePix = this.paramsLocais.getOpcoes().permitir_qualquer_chave_pix;
        this.desafioNome = this.paramsLocais.getOpcoes().desafio_nome;
        this.isMandatoryPhoneValidation = this.paramsLocais.isMandatoryPhoneValidation();

        switch (this.router.url) {
            case '/cambistas/cartoes':
            case '/cambistas/solicitacoes-saque':
                this.subCartao = true;
                break;
            case '/clientes/perfil':
            case '/clientes/perfil-pix':
            case '/alterar-senha':
            case '/ultimos-acessos':
            case '/bank-accounts':
                this.subPerfil = true;
                break;
            case '/clientes/saque':
            case '/clientes/deposito':
            case '/clientes/transacoes-historico':
                this.subTransacoes = true;
                break;
        }

        this.auth.logado
            .subscribe(
                logado => {
                    this.isLogado = logado;
                    if (logado) {
                        this.auth.cliente
                            .subscribe(
                                isCliente => {
                                    this.isNotCambista = isCliente;
                                }
                            );

                        this.userPhoneValidated = this.auth.getUser().phone_validated;
                    } else {
                        this.isNotCambista = false;
                    }
                }
            );

        this.ligasPopulares = this.getLigasPopulares();

        this.createForm();

        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(dados => {
                this.contexto = dados.contexto;
                this.itens = dados.itens;

                if (dados.esporte) {
                    this.esporte = dados.esporte;
                }
            });

        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }

        if (this.isNotCambista) {
            this.initAccountVerification();
        }
    }

    private initAccountVerification() {
        this.accountVerificationService
            .accountVerified
            .subscribe((accountVerified) => this.accountVerified = accountVerified)
    }

    private getLigasPopulares() {
        return this.paramsLocais.getLigasPopulares().map((ligaPopular) => {
            if (ligaPopular.sport_id === 1) {
                ligaPopular.nome = ligaPopular.nome.substring(ligaPopular.nome.indexOf(':') + 1);
            }
            return ligaPopular;
        }).sort((a, b) => a.sport_id - b.sport_id).sort((a, b) => {
            const nomeA = a.nome.toUpperCase();
            const nomeB = b.nome.toUpperCase();

            if (nomeA < nomeB) {
                return -1;
            }

            if (nomeA > nomeB) {
                return 1;
            }

            return 0;
        });
    }

    createForm() {
        this.form = this.fb.group({
            codigo: ['', Validators.compose([
                Validators.required
            ])]
        });
    }

    submit() {
        const codigo = this.form.value.codigo;

        this.apostaService.getApostaByCodigo(codigo)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                aposta => {
                    this.form.reset();

                    let size = aposta.tipo == 'esportes' ? 'lg' : '';
                    let typeWindow = aposta.tipo == 'esportes'? 'modal-700' : '';

                    const modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true,
                        size: size,
                        windowClass: typeWindow
                    });

                    modalRef.componentInstance.aposta = aposta;
                    modalRef.componentInstance.primeiraImpressao = true;
                    modalRef.componentInstance.showCancel = true;
                },
                error => this.messageService.error(error)
            );
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirRegiao(regiao) {
        if (regiao === this.regiaoOpen) { // fechando
            this.regiaoOpen = null;
        } else { // abrindo
            this.regiaoOpen = regiao;
        }
    }

    /* Geração dos números aleatórios para loteria */
    gerarSupresinha(length, context) {
        const numbers = [];

        for (let index = 0; index < length; index++) {
            const number = this.generateRandomNumber(numbers, context);
            numbers.push(number);
        }

        numbers.sort((a, b) => a - b);
        this.supresinhaService.atualizarSupresinha(numbers);
    }

    /* Gerar número randômico */
    generateRandomNumber(numbers: Number[], context) {
        let number;

        if (context === 'seninha') {
            number = random(1, 60);
        } else {
            number = random(1, 80);
        }

        const find = numbers.find(n => n === number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber(numbers, context);
        }
    }

    goTo(url, queryParams) {
        this.router.navigate([url], { queryParams });
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

    toogleSubCartao() {
        this.subCartao = !this.subCartao;
    }

    toogleSubPerfil() {
        this.subPerfil = !this.subPerfil;
    }

    toogleSubPromocoes() {
        this.subPromocoes = !this.subPromocoes;
    }

    toggleSubTransacoes() {
        this.subTransacoes = !this.subTransacoes;
    }

    logout() {
        this.auth.logout();
    }

    getIconClassLigasPopulares(sportId) {
        let className = 'icon-futebol wbicon';

        switch (sportId) {
            case this.footballId: {
                className = 'wbicon icon-futebol';
                break;
            }
            case this.boxingId: {
                className = 'wbicon icon-luta';
                break;
            }
            case this.americanFootballId: {
                className = 'wbicon icon-futebol-americano';
                break;
            }
            case this.tennisId: {
                className = 'wbicon icon-tenis';
                break;
            }
            case this.iceHockeyId: {
                className = 'wbicon icon-hoquei-no-gelo';
                break;
            }
            case this.basketballId: {
                className = 'wbicon icon-basquete';
                break;
            }
            case this.futsalId: {
                className = 'wbicon icon-futsal';
                break;
            }
            case this.volleyballId: {
                className = 'wbicon icon-volei';
                break;
            }
            case this.eSportsId: {
                className = 'wbicon icon-e-sports';
                break;
            }
        }

        return className;
    }

    getRotaPorEsporteId(sportId) {
        const routeBySportId = {};

        routeBySportId[String(this.footballId)] = '/esportes/futebol';
        routeBySportId[String(this.boxingId)] = '/esportes/combate';
        routeBySportId[String(this.americanFootballId)] = '/esportes/futebol-americano';
        routeBySportId[String(this.tennisId)] = '/esportes/tenis';
        routeBySportId[String(this.iceHockeyId)] = '/esportes/hoquei-gelo';
        routeBySportId[String(this.basketballId)] = '/esportes/basquete';
        routeBySportId[String(this.futsalId)] = '/esportes/futsal';
        routeBySportId[String(this.volleyballId)] = '/esportes/volei';
        routeBySportId[String(this.eSportsId)] = '/esportes/esports';

        return routeBySportId[sportId] ?? '/esportes/futebol';
    }

    openValidatePhoneModal() {
        const modalRef = this.modalService.open(ValidatePhoneModalComponent, {
            ariaLabelledBy: "modal-basic-title",
            windowClass: "modal-550 modal-h-350",
            centered: true,
        });

        modalRef.result.then(
            (result) => {
                this.userPhoneValidated = this.auth.getUser().phone_validated;
                this.cd.detectChanges();
            },
            (reason) => {console.log(reason);
            }
        );
    }
}
