import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {SidebarService} from '../../services/utils/sidebar.service';

import * as random from 'lodash.random';
import {SupresinhaService} from '../../services/utils/surpresinha.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {BaseFormComponent} from '../../layout/base-form/base-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ApostaService} from '../../services/aposta.service';
import {MessageService} from '../../services/utils/message.service';
import {
    ApostaModalComponent,
    CartaoCadastroModalComponent,
    PesquisarCartaoModalComponent,
    RecargaCartaoModalComponent,
    SolicitarSaqueModalComponent
} from '../../layout/modals';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth/auth.service';
import {ParametrosLocaisService} from '../../services/parametros-locais.service';

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
    regioesDestaque;
    isNotCambista = true;
    whatsapp;
    cartaoApostaHabilitado;

    subCartao = false;
    subPerfil = false;

    iconesGenericos = {
        'futsal': 'wbicon icon-futsal',
        'volei': 'wbicon icon-volei',
        'basquete': 'wbicon icon-basquete',
        'combate': 'wbicon icon-luta',
        'hoquei-gelo': 'wbicon icon-hoquei-no-gelo',
        'futebol-americano': 'wbicon icon-futebol-americano',
        'esports': 'wbicon icon-e-sports',
        'tenis': 'wbicon icon-tenis'
    };

    constructor(
        private router: Router,
        private fb: FormBuilder,
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

        if  (this.router.url === '/cambistas/cartoes' || this.router.url === '/cambistas/solicitacoes-saque') {
            this.subCartao = true;
        }

        if (this.router.url === '/clientes/perfil' || this.router.url === '/clientes/perfil-pix' || this.router.url === '/alterar-senha') {
            this.subPerfil = true;
        }

        this.auth.logado
        .subscribe(
            logado => {
                if (logado) {
                    this.auth.cliente
                        .subscribe(
                            isCliente => {
                                this.isNotCambista = isCliente;
                            }
                        );
                }
            }
        );

        this.regioesDestaque = this.paramsLocais.getOpcoes().regioes_destaque;

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

                    const modalRef = this.modalService.open(ApostaModalComponent, {
                        ariaLabelledBy: 'modal-basic-title',
                        centered: true
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
        this.router.navigate([url], {queryParams});
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

    logout() {
        this.auth.logout();
    }
}
