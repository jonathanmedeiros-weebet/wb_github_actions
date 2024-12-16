import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, MenuFooterService, MessageService, SidebarService } from 'src/app/services';

@Component({
  selector: 'app-last-accesses-modal',
  templateUrl: './last-accesses-modal.component.html',
  styleUrls: ['./last-accesses-modal.component.css']
})
export class LastAccessesModalComponent implements OnInit, OnDestroy{

    public collapsed = false;
    private unsub$ = new Subject();
    public accesses = [];
    public showLoading = true;
    public selectedDate = '';
    public qttAccessesFound = 0;

    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    hoveredDate: NgbDate | null = null;

    form = this.fb.group({
        dateFrom: ['', Validators.required],
        dateTo: ['', Validators.required],
        type: ['']
    });

    currentPage = 1;
    totalPages  = 1;
    itemsPerPage = 10;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private auth: AuthService,
        private sidebarService: SidebarService,
        private menuFooterService: MenuFooterService,
        private calendar: NgbCalendar,
        private messageService: MessageService,
        public formatter: NgbDateParserFormatter,
        public activeModal: NgbActiveModal,
    ) {
        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();
    }

    get isCliente() {
        return this.auth.isCliente();
    }

    ngOnInit(): void {
        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
        this.loadAccessLogs();

        if (this.isCliente) {
            this.sidebarService.changeItens({contexto: 'cliente'});
        } else {
            this.sidebarService.changeItens({contexto: 'cambista'});
        }

        this.menuFooterService.setIsPagina(true);
    }

    ngOnDestroy(): void {
        this.unsub$.next();
        this.unsub$.complete();
        this.menuFooterService.setIsPagina(false);

    }

    loadAccessLogs() {
        this.showLoading = true;

        const filters = {
            userId: this.authService.getUser().id,
            dateFrom: this.form.get('dateFrom')?.value,
            dateTo: this.form.get('dateTo')?.value,
            type: this.form.get('type')?.value,
            page: this.currentPage,
            itemsPerPage: this.itemsPerPage
        };

        this.authService.getLastAccesses(filters)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                response => {
                    this.accesses = response.results;
                    this.totalPages = response.last_page;
                    this.currentPage = response.current_page;
                    this.qttAccessesFound = response.total;
                    this.showLoading = false;
                },
                error => {
                    this.messageService.error('Erro ao carregar os registros de acesso.');
                    this.showLoading = false;
                }
            );
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.loadAccessLogs();
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.form.patchValue({ dateFrom: this.formatDate(date, 'us') });
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.form.patchValue({ dateTo: this.formatDate(date, 'us') });
            this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.form.patchValue({ dateTo: null });
            this.fromDate = date;
            this.form.patchValue({ dateFrom: this.formatDate(date, 'us') });
        }
    }

    onSubmit() {
        this.loadAccessLogs();
    }

    formatDate(date: NgbDate | null, format = 'br'): string {
        if (!date) { return ''; }
        if (format === 'us') {
            return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        }
        return `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
            date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }
}

