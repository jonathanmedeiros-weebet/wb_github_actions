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
    SolicitarSaqueModalComponent
} from '../../layout/modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth/auth.service';
import { ParametrosLocaisService } from '../../services/parametros-locais.service';

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
    pixCambista = false;
    modoCambista = true;
    indiqueGanheHabilitado = false;

    subCartao = false;
    subPerfil = false;
    subPromocoes = false;

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
        private paramsLocais: ParametrosLocaisService
    ) {
        super();
    }

    ngOnInit() {
        this.cartaoApostaHabilitado = this.paramsLocais.getOpcoes().cartao_aposta;
        this.pixCambista = this.paramsLocais.getOpcoes().pix_cambista;
        this.modoCambista = this.paramsLocais.getOpcoes().modo_cambista;
        this.indiqueGanheHabilitado = this.paramsLocais.indiqueGanheHabilitado();

        if (this.router.url === '/cambistas/cartoes' || this.router.url === '/cambistas/solicitacoes-saque') {
            this.subCartao = true;
        }

        if (this.router.url === '/clientes/perfil' || this.router.url === '/clientes/perfil-pix' || this.router.url === '/alterar-senha') {
            this.subPerfil = true;
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

    logout() {
        this.auth.logout();
    }

    getIconClassLigasPopulares(sportId) {
        let className = 'icon-futebol wbicon';

        switch (sportId) {
            case 1: {
                // Futebol
                className = 'wbicon icon-futebol';
                break;
            }
            case 9: {
                // Combate
                className = 'wbicon icon-luta';
                break;
            }
            case 12: {
                // Futebol Americano
                className = 'wbicon icon-futebol-americano';
                break;
            }
            case 13: {
                // Tennis
                className = 'wbicon icon-tenis';
                break;
            }
            case 17: {
                // Ice Hockey
                className = 'wbicon icon-hoquei-no-gelo';
                break;
            }
            case 18: {
                // Basquetebol
                className = 'wbicon icon-basquete';
                break;
            }
            case 83: {
                // Futsal
                className = 'wbicon icon-futsal';
                break;
            }
            case 91: {
                // Volleyball
                className = 'wbicon icon-volei';
                break;
            }
            case 151: {
                // Esports
                className = 'wbicon icon-e-sports';
                break;
            }
        }

        return className;
    }

    getRotaPorEsporteId(sportId) {
        const rotaPorSporteId = {
            1: '/esportes/futebol',
            9: '/esportes/combate',
            12: '/esportes/futebol-americano',
            13: '/esportes/tenis',
            17: '/esportes/hoquei-gelo',
            18: '/esportes/basquete',
            83: '/esportes/futsal',
            91: '/esportes/volei',
            151: '/esportes/esports',
        };

        return rotaPorSporteId[sportId] ?? '/esportes/futebol';
    }
}
