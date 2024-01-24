import { Component, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { AuthService, ClienteService, MessageService, ParametrosLocaisService, SidebarService } from 'src/app/services';
import { IndiqueGanheService } from 'src/app/shared/services/clientes/indique-ganhe.service';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';

declare var WeebetMessage: any;

@Component({
  selector: 'app-indique-ganhe',
  templateUrl: './indique-ganhe.component.html',
  styleUrls: ['./indique-ganhe.component.css']
})
export class IndiqueGanheComponent extends BaseFormComponent implements OnInit {
    tabSelected = 'link_compartilhamento';

    @ViewChild('regrasCondicoesModal', {static: true}) regrasCondicoesModal;
    @ViewChild('minhasIndicacoesModal', {static: true}) minhasIndicacoesModal;
    linkIndicacao: string = "";
    valorGanhoPorIndicacao;
    limiteIndicacoes;
    valorMinDepositado;
    valorMinApostado;
    qtdDiasRequisitos;
    tipoSaldoGanho;
    prazoResgateSaldo;
    modalidadePromocao;

    nomeBanca;

    linkFacebook;
    linkWhatsapp;
    linkTelegram;
    linkEmail;

    mobileScreen;
    isAppMobile;

    queryParams;
    dataInicial;
    dataFinal;

    loading = false;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    indicados = [];
    indicadoSelecionado;

    total = {
        recebido: 0,
        pendente: 0
    };

    constructor(
        private activeModal: NgbActiveModal,
        private activeRulesModal: NgbActiveModal,
        private activeReferralsModal: NgbActiveModal,
        private authService: AuthService,
        private calendar: NgbCalendar,
        private clienteService: ClienteService,
        private clipboard: Clipboard,
        private fb: UntypedFormBuilder,
        public formatter: NgbDateParserFormatter,
        private indiqueGanheService: IndiqueGanheService,
        private messageService: MessageService,
        private modalService: NgbModal,
        private paramsLocaisService: ParametrosLocaisService,
        private sidebarService: SidebarService,
        private translateService: TranslateService
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();

        this.queryParams = {
            dataInicial: this.formatDate(this.fromDate, 'us'),
            dataFinal: this.formatDate(this.toDate, 'us'),
            status: ''
        }

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        this.valorGanhoPorIndicacao = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_por_indicacao;
        this.limiteIndicacoes = this.paramsLocaisService.getOpcoes().indique_ganhe_limite;
        this.valorMinDepositado = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_min_depositado;
        this.valorMinApostado = this.paramsLocaisService.getOpcoes().indique_ganhe_valor_min_apostado;
        this.qtdDiasRequisitos = this.paramsLocaisService.getOpcoes().indique_ganhe_qtd_dias_max;
        this.tipoSaldoGanho = this.paramsLocaisService.getOpcoes().indique_ganhe_tipo_saldo_ganho;
        this.prazoResgateSaldo = this.paramsLocaisService.getOpcoes().indique_ganhe_prazo_resgate_saldo;
        this.modalidadePromocao = this.paramsLocaisService.getOpcoes().indique_ganhe_modalidade_promocao;
        this.nomeBanca = this.paramsLocaisService.getOpcoes().banca_nome;
        this.mobileScreen = window.innerWidth <= 1024;
        this.isAppMobile = this.authService.isAppMobile();

        this.clienteService.getCodigoIndicacao()
            .subscribe(
                response => {
                    this.linkIndicacao = `${location.origin}/cadastro?refId=${response.codigoIndicacao}`;

                    let indicacaoMsg = encodeURIComponent("Quer ganhar uma graninha extra e se divertir?\nÉ só criar uma conta através deste link e aproveitar!");

                    this.linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.linkIndicacao)}`;
                    this.linkWhatsapp = `https://api.whatsapp.com/send/?text=${indicacaoMsg}%0A${encodeURIComponent(this.linkIndicacao)}&type=custom_url&app_absent=0`;
                    this.linkTelegram = `https://telegram.me/share/url?url=${encodeURIComponent(this.linkIndicacao)}&text=${indicacaoMsg}`;
                    this.linkEmail = `mailto:?&subject=&cc=&bcc=&body=${encodeURIComponent(this.linkIndicacao)}%0A`;
                },
                error => {
                    this.messageService.error(error);
                }
            );

        this.createForm();

        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        }
    }

    changeTab(tab) {
        this.tabSelected = tab;
        if (tab === "minhas_indicacoes") {
            this.getIndicacoes();
        }
    }

    abrirModalRegras()
    {
        this.activeRulesModal = this.modalService.open(
            this.regrasCondicoesModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
    }

    tipoSaldoGanhoModalRegras(detalhado = false) {
        if (detalhado) {
            this.tipoSaldoGanho == 'real' ? 'real (sacável)' : 'bônus (' + this.modalidadePromocao + ')';
            switch (this.tipoSaldoGanho) {
                case 'real':
                    return this.translateService.instant('regras_indique_ganhe.real_sacavel');
                case 'bonus':
                    return this.translateService.instant('geral.bonus').toLowerCase() +
                        " (" + this.translateService.instant('geral.' + this.modalidadePromocao).toLowerCase() + ")";
                default:
                    return "";
            }
        } else {
            switch (this.tipoSaldoGanho) {
                case 'real':
                    return "real";
                case 'bonus':
                    return this.translateService.instant('geral.bonus').toLowerCase();
                default:
                    return "";
            }
        }
    }

    abrirModalMinhasIndicacoes(indicadoSelecionado)
    {
        this.indicadoSelecionado = indicadoSelecionado;
        this.activeReferralsModal = this.modalService.open(
            this.minhasIndicacoesModal,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true
            }
        );
    }

    copiarLink() {
        if (this.linkIndicacao && this.clipboard.copy(this.linkIndicacao)) {
            this.messageService.success(this.translateService.instant('indique_ganhe.linkCopiado'));
        }
    }

    compartilharLink() {
        if (this.linkIndicacao) {
            if (this.isAppMobile) {
                WeebetMessage.postMessage(JSON.stringify({
                    message: `Quer ganhar uma graninha extra e se divertir?\nÉ só criar uma conta através deste link e aproveitar!\n${this.linkIndicacao}`,
                    action: 'shareURL'
                }));
            } else {
                if (window.navigator.share) {
                    window.navigator.share({
                        text: "Quer ganhar uma graninha extra e se divertir?\nÉ só criar uma conta através deste link e aproveitar!\n",
                        url: this.linkIndicacao
                    })
                } else {
                    this.messageService.error('Compartilhamento não suportado pelo seu navegador');
                }
            }
        }
    }

    getIndicacoes() {
        this.loading = true;

        const queryParams: any = {
            'data-inicial': this.queryParams.dataInicial,
            'data-final': this.queryParams.dataFinal,
            'status': this.queryParams.status,
            'sort': '-dataRegistro'
        };

        this.indiqueGanheService.getIndicacoes(queryParams)
            .subscribe(
                indicacoes => this.handleResponse(indicacoes),
                error => this.handleError(error)
            );
    }

    redeemCommission(commissionId) {
        this.indiqueGanheService.redeemCommission(commissionId)
            .subscribe(
                response => this.handleRedeemCommission(response),
                error => this.handleError(error)
            );

    }

    handleRedeemCommission(response) {
        this.messageService.success(response.message);
        this.indicados.forEach((currentIndicado, index, indicados) => {
            if (currentIndicado.comissao_id == response.commissionId) {
                indicados[index].status = 'pago';
                indicados[index].comissionado_em.data_hora = response.commissioned_in;
                this.total.recebido += currentIndicado.valor_comissao;
                this.total.pendente -= currentIndicado.valor_comissao;
                return;
            }
        })
    }

    setStatusIcon(status) {
        switch (status) {
            case 'pago':
                return 'fa-solid fa-gift';
            case 'pendente':
            case 'resgate':
                return 'fa-regular fa-clock';
            case 'anulado':
                return 'fa-regular fa-circle-xmark';
        }
    }

    setProgressFillClass(indicado) {
        if (indicado.status === "anulado") {
            return "no-fill";
        } else if (indicado.progresso.deposito_cumprido && indicado.progresso.aposta_cumprida) {
            return "fill-three";
        } else if (indicado.progresso.deposito_cumprido) {
            return "fill-two";
        }

        return "fill-one";
    }

    translateStatus(status) {
        switch (status) {
            case 'pago':
                return this.translateService.instant('geral.depositado');
            case 'resgate':
                return this.translateService.instant('indique_ganhe.resgatar');
            case 'pendente':
                return this.translateService.instant('geral.pendente');
            case 'anulado':
                return this.translateService.instant('geral.cancelado');
        }
    }

    translateTipoSaldo(tipoSaldo) {
        switch (tipoSaldo) {
            case 'real':
                return "Real";
            case 'bonus':
                return this.translateService.instant('geral.bonus');
            default:
                return "";
        }
    }

    setAmountColor(status) {
        switch (status) {
            case 'pago':
                return "#0C9F19";
            case 'pendente':
            case 'resgate':
                return "#6A6868";
            case 'anulado':
                return "#E9283B";
            default:
                return "#6A6868";
        }
    }

    formatDateModal(referral_date) {
        const date = new Date(referral_date);
        const days_of_week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        const nomeMes = this.translateService.instant(`data.${months[date.getMonth()]}`).toLowerCase();

        return this.translateService.instant(`data.${days_of_week[date.getDay()]}`) +
            ", " +
            this.translateService.instant('data.diaDeNomeMes', {'dia': date.getDate(), 'nomeMes': nomeMes}); 
    }

    createForm() {
        this.form = this.fb.group({
            dataInicial: [this.formatDate(this.fromDate, 'us'), Validators.required],
            dataFinal: [this.formatDate(this.toDate, 'us'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleResponse(response: any) {
        this.indicados = response;

        this.total.recebido = 0;
        this.total.pendente = 0;

        response.forEach(indicacao => {
            if (indicacao.status === "pago") {
                this.total.recebido += indicacao.valor_comissao;
            } else if (["pendente", "resgate"].includes(indicacao.status)) {
                this.total.pendente += indicacao.valor_comissao;
            }
        });

        this.loading = false;
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.loading = false;
    }

    submit() {
        this.queryParams = this.form.value;
        this.getIndicacoes();
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.form.value.dataInicial = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.form.value.dataFinal = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.form.value.dataFinal = null;
            this.fromDate = date;
            this.form.value.dataInicial = this.formatDate(date, 'us');
        }
    }

    formatDate(date, lang = 'br') {
        if(lang == 'us') {
            return  date.year + '-' + String(date.month).padStart(2, '0') + "-" + String(date.day).padStart(2, '0');
        }
        return String(date.day).padStart(2, '0') + '/' + String(date.month).padStart(2, '0') + "/" + date.year
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
            date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }
}
