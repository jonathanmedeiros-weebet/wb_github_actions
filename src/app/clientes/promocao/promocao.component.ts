import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FinanceiroService, MessageService, SidebarService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { UntypedFormBuilder } from '@angular/forms';
import { Rollover, RodadaGratis } from '../../models';
import { Router } from '@angular/router';
import { ConfirmModalComponent, CanceledBonusConfirmComponent } from 'src/app/shared/layout/modals';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegrasBonusModalComponent } from './../../shared/layout/modals/regras-bonus-modal/regras-bonus-modal.component';
import { ParametrosLocaisService } from '../../shared/services/parametros-locais.service';
import { MenuFooterService } from '../../shared/services/utils/menu-footer.service';
import { FreeSpinService } from '../../shared/services/clientes/free-spin.service';
@Component({
    selector: 'app-promocao',
    templateUrl: './promocao.component.html',
    styleUrls: ['./promocao.component.css']
})
export class PromocaoComponent extends BaseFormComponent implements OnInit {
    modalRef;
    showLoading = false;
    queryParams;
    loading = true;
    whatsapp;
    mobileScreen;
    rodadasListagem;
    rolloversListagem;
    quantityRoundsToNotify: number = 0;
    quantityRolloversToNotify: number = 0;
    rollovers: Rollover[] = [];
    rodadas: RodadaGratis[] = [];

    order: string = 'status';
    reverse: boolean = false;
    tabSelected = 'bonus';
    dataAtual;
    date1: string = '';
    date2: string = '';
    isButtonDisabled = false;
    isRescued = false;


    constructor(
        private financeiroService: FinanceiroService,
        private sidebarService: SidebarService,
        private messageService: MessageService,
        private menuFooterService: MenuFooterService,
        private paramsLocais: ParametrosLocaisService,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private router: Router,
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private freeSpinService: FreeSpinService,
        private activeRulesModal: NgbActiveModal
    ) { super(); }

    ngOnInit(): void {
        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({ contexto: 'cliente' });
            this.menuFooterService.setIsPagina(true);
        }

        const url: string = window.location.href;
        if (!url.includes("clientes/rollover") && !this.mobileScreen) {
            this.tabSelected = 'rodada-gratis';
        }

        this.getRollovers();
        this.createForm();
        this.dataAtual = new Date();
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    changeTab(tab) {
        this.tabSelected = tab;
        this.getRollovers();
    }

    createForm() {
        this.form = this.fb.group({
            status: [''],
            statusRollover: ['']
        });

        this.submit();
    }

    submit() {
        this.queryParams = this.form.value;
        const queryParams: any = {
            'status': this.queryParams.status,
        };
    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    abrirRegrasBonus() {
        this.modalService.open(RegrasBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }

    getRollovers(queryParams?: any) {
        this.showLoading = true;
        this.financeiroService.getRollovers(queryParams)
            .subscribe(
                response => {
                    this.rollovers = response.rollovers.map((rollover) => ({
                        ...rollover,
                        modalidade: rollover.modalidade == 'cassino'
                            ? this.paramsLocais.getCustomCasinoName().toLowerCase()
                            : rollover.modalidade
                    }));
                    this.rodadas = response.rodadas.map(rodada => {
                        const customStatusFreeSpin = rodada.ativo ? (new Date(rodada.dataTermino.date) > new Date() ? 'Ativo' : 'Expirado') : (rodada.quantidade <= rodada.quantidadeUtilizada ? 'Concluído' : 'Cancelado');
                        return { ...rodada, customStatusFreeSpin };
                    });
                    this.rodadas.sort((a, b) => {
                        const statusOrder = { 'Ativo': 1, 'Expirado': 2, 'Cancelado': 3, 'Concluído': 4};
                        return statusOrder[a.status] - statusOrder[b.status];
                    });

                    this.rodadasListagem = this.rodadas;
                    this.rolloversListagem = this.rollovers;
                    this.showLoading = false;
                    this.loading = false;
                    this.setQuantityRoundsToNotify();
                    this.setQuantityRolloversToNotify();
                },
                error => {
                    this.handleError(error);
                    this.showLoading = false;
                }
            );
    }

    converterBonus(rolloverId) {
        this.modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
        this.modalRef.componentInstance.title = 'Converter Bônus';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja converter seu bônus em saldo real?';

        this.modalRef.result.then(
            () => {
                this.financeiroService.converterBonus(rolloverId)
                    .subscribe(
                        response => {
                            this.messageService.success('Bônus Convertido');
                            this.submit();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    cancelarBonus(rolloverId) {
        this.modalRef = this.modalService.open(CanceledBonusConfirmComponent, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'md',
            centered: true,
            windowClass: 'modal-537 modal-cadastro-cliente'
        });

        this.modalRef.result.then(
            () => {
                this.financeiroService.cancelarBonus(rolloverId)
                    .subscribe(
                        response => {
                            this.messageService.success('Bônus Cancelado');
                            this.submit();
                            this.getRollovers();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    filtrarPorStatus() {
        const statusSelecionado = this.form.get('status').value.toLowerCase();

        this.rodadasListagem = statusSelecionado === ''
            ? [...this.rodadas]
            : this.rodadas.filter(rodada => rodada.status.toLowerCase() === statusSelecionado);
    }

    filtarRolloverStatus() {
        const statusSelecionado = this.form.get('statusRollover').value.toLowerCase();

        this.rolloversListagem = statusSelecionado === ''
            ? [...this.rollovers]
            : this.rollovers.filter(rollover => rollover.status === statusSelecionado);
    }

    sortBy(field: string) {
        this.cd.detectChanges();

        if (this.order === field) {
            this.reverse = !this.reverse;
        }

        this.order = field;
        this.rodadasListagem.sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];

            if (valueA < valueB) {
                return this.reverse ? 1 : -1;
            } else if (valueA > valueB) {
                return this.reverse ? -1 : 1;
            } else {
                return 0;
            }
        });
    }

    openGame(game: string, fornecedor: string) {
        this.router.navigate(['casino/', fornecedor, game]);
    }

    setQuantityRoundsToNotify(): void{
        this.quantityRoundsToNotify = this.rodadas.filter(obj => obj.status === 'pendente').length;
    }

    setQuantityRolloversToNotify(): void{
        this.quantityRolloversToNotify = this.rollovers.filter(obj => obj.status === 'ativo').length;
    }

    redeemPrize(freeRoundId: string) {
        this.isButtonDisabled = true;

        this.freeSpinService.redeemPrize(freeRoundId).subscribe(
            response => {
                this.handleRedeemPrize(response)
                this.isButtonDisabled = false;
                this.getRollovers();
            },
            error => {
                this.handleError(error)
                this.isButtonDisabled = false;
                this.getRollovers();
            }
        );
    }

    handleRedeemPrize(response) {
        this.messageService.success(response.message);
    }

    parseDate( dateStr: string) {
        const [day, month, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month -1, day);
        return !isNaN(date.getTime()) ? date : null;
    }


    isDateGreater(date1: Date, date2: Date) {
        return date1 > date2;
    }
}
