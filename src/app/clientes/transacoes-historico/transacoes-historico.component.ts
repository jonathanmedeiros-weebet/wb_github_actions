import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';

import { FinanceiroService, LayoutService, MenuFooterService, MessageService, SidebarService } from 'src/app/services';

@Component({
  selector: 'app-transacoes-historico',
  templateUrl: './transacoes-historico.component.html',
  styleUrls: ['./transacoes-historico.component.css']
})
export class TransacoesHistoricoComponent extends BaseFormComponent implements OnInit, OnDestroy {
    unsub$ = new Subject();
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    withdrawals = [];
    deposits = [];
    queryParams;

    statusFilterOptions;

    statusDepositOptions = [
        [
            'approved',
            'geral.approved'
        ],
        [
            'pending',
            'geral.pendente'
        ],
        [
            'cancelled',
            'geral.cancelado'
        ],
    ];

    statusWithdrawalOptions = [
        [
            'PAGO',
            'geral.approved'
        ],
        [
            'PENDENTE',
            'geral.pendente'
        ],
        [
            'REPROVADO',
            'geral.failed'
        ],
        [
            'CANCELADO',
            'geral.cancelado'
        ],
    ];

    tabSelected: string = 'deposits';
    selectedDate: string = '';
    dateFrom;
    dateTo;

    qttDepositsFound = 0;
    qttWithdrawalsFound = 0;
    headerHeight = 92;

    showLoading = true;
    showLoadingModal = true;
    mobileScreen = false;

    constructor(
        public activeModal: NgbActiveModal,
        private financeiroService: FinanceiroService,
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private cd: ChangeDetectorRef,
        private el: ElementRef,
        private layoutService: LayoutService,
        private renderer: Renderer2,
        private fb: UntypedFormBuilder,
        private calendar: NgbCalendar,
        private translateService: TranslateService,
        public formatter: NgbDateParserFormatter
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();

        this.queryParams = {
            dateFrom: this.formatDate(this.fromDate, 'us'),
            dateTo: this.formatDate(this.toDate, 'us'),
            status: ''
        };

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        if (window.innerWidth <= 1024) {
            this.mobileScreen = true;
        }

        this.sidebarService.changeItens({ contexto: 'cliente' });

        this.getDeposits();
        this.statusFilterOptions = this.statusDepositOptions;

        this.createForm();

        if (!this.mobileScreen) {
            this.layoutService.currentHeaderHeight
                .pipe(takeUntil(this.unsub$))
                .subscribe(curHeaderHeight => {
                    this.headerHeight = curHeaderHeight;
                    this.changeHeight();
                    this.cd.detectChanges();
                });
        }
    }

    changeHeight() {
        const headerHeight = this.headerHeight;
        const height = window.innerHeight - headerHeight;
        const defaultContent = this.el.nativeElement.querySelector('#default-content');
        this.renderer.setStyle(defaultContent, 'height', `${height}px`);
    }

    ngOnDestroy(): void {
        this.menuFooterService.setIsPagina(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    getTabs(): any[] {
        const tabs: any[] = [
            { id: 'deposits', label: 'geral.depositos' },
            { id: 'withdrawals', label: 'geral.saques' }
        ];

        return tabs;
    }

    getWithdrawals() {
        this.queryParams.type = 'saques';

        this.financeiroService.getDepositosSaques(this.queryParams)
            .subscribe(
                response => {
                    this.withdrawals = response;
                    this.qttWithdrawalsFound = response.length;
                    this.showLoading = false;
                },
                error => {
                    this.errorHandler(error);
                }
            );
    }

    getDeposits() {
        this.queryParams.type = 'depositos';

        this.financeiroService.getDepositosSaques(this.queryParams)
            .subscribe(
                response => {
                    this.deposits = response;
                    this.qttDepositsFound = response.length;
                    this.showLoading = false;
                },
                error => {
                    this.errorHandler(error);
                }
            );
    }

    errorHandler(error: string) {
        this.messageService.error(error);
        this.menuFooterService.setIsPagina(false);
    }

    changeTab(tab) {
        this.showLoading = true;
        this.tabSelected = tab;
        switch (tab) {
            case 'withdrawals':
                this.getWithdrawals();
                this.statusFilterOptions = this.statusWithdrawalOptions;
                break;
            case 'deposits':
                this.getDeposits();
                this.statusFilterOptions = this.statusDepositOptions;
                break;
        }
    }

    formatarChavePix(chavePix: string, tipoChavePix: string): string {
        let chavePixFormatada: any;
        switch (tipoChavePix) {
            case 'phone':
                chavePixFormatada = chavePix.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                break;
            case 'random':
                chavePixFormatada = chavePix.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, "$1-$2-$3-$4-$5");
                break;
            case 'cpf':
                chavePixFormatada = chavePix.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                break;
            default:
                chavePixFormatada = chavePix;
                break;
        }
        return chavePixFormatada;
    }

    createForm() {
        this.form = this.fb.group({
            dateFrom: [this.formatDate(this.fromDate, 'us'), Validators.required],
            dateTo: [this.formatDate(this.toDate, 'us'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.showLoading = false;
    }

    submit() {
        this.queryParams = this.form.value;
        switch (this.tabSelected) {
            case 'deposits':
                this.getDeposits();
                break;
            case 'withdrawals':
                this.getWithdrawals();
                break;
        }
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.form.value.dateFrom = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.form.value.dateTo = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.form.value.dateTo = null;
            this.fromDate = date;
            this.form.value.dateFrom = this.formatDate(date, 'us');
        }
    }

    formatDate(date, lang = 'br') {
        if(lang == 'us') {
            return  date.year + '-' + String(date.month).padStart(2, '0') + "-" + String(date.day).padStart(2, '0');
        }
        return String(date.day).padStart(2, '0') + '/' + String(date.month).padStart(2, '0') + "/" + date.year;
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
