import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { AuthService, MessageService, SidebarService } from 'src/app/services';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import { CashbackService } from 'src/app/shared/services/clientes/cashback.service';

@Component({
    selector: 'app-cashback',
    templateUrl: './cashback.component.html',
    styleUrls: ['./cashback.component.css']
})
export class CashbackComponent extends BaseFormComponent implements OnInit {
    mobileScreen: boolean;
    isAppMobile: boolean;

    queryParams: any;

    loading = false;

    hoveredDate: NgbDate | null = null;
    selectedDate: string = '';

    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    cashbacks = [];

    constructor(
        private authService: AuthService,
        private calendar: NgbCalendar,
        private fb: UntypedFormBuilder,
        public formatter: NgbDateParserFormatter,
        private messageService: MessageService,
        private sidebarService: SidebarService,
        private translateService: TranslateService,
        private cashbackService: CashbackService,
    ) {
        super();

        this.fromDate = calendar.getNext(calendar.getToday(), 'd', -6);
        this.toDate = calendar.getToday();

        this.queryParams = {
            fromDate: this.formatDate(this.fromDate, 'us'),
            toDate: this.formatDate(this.toDate, 'us'),
            status: ''
        }

        this.selectedDate = this.formatDate(this.fromDate) + ' - ' + this.formatDate(this.toDate);
    }

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        this.isAppMobile = this.authService.isAppMobile();

        this.createForm();

        if (!this.mobileScreen) {
            this.sidebarService.changeItens({ contexto: 'cliente' });
        }
    }

    getCashbacks() {
        this.loading = true;

        const queryParams: any = {
            'to_date': this.queryParams.toDate,
            'from_date': this.queryParams.fromDate,
            'status': this.queryParams.status,
        };

        this.cashbackService.getCashbacks(queryParams)
            .subscribe(
                cashbacks => this.handleResponse(cashbacks),
                error => this.handleError(error)
            );
    }

    redeemCashback(cashbackId: number) {
        this.cashbackService.redeemCashback(cashbackId)
            .subscribe(
                response => this.handleRedeemCashback(response),
                error => this.handleError(error)
            );

    }

    handleRedeemCashback(response: any) {
        this.messageService.success(response.message);
        this.cashbacks.forEach((current, index, cashbacks) => {
            if (current.id == response.cashback_id) {
                cashbacks[index].status = 'redeemed';
                return;
            }
        })
    }

    setStatusIcon(status: string) {
        switch (status) {
            case 'redeemed':
                return 'fa-solid fa-gift';
            case 'pending':
                return 'fa-regular fa-clock';
        }
    }

    translateStatus(status: string) {
        return this.translateService.instant(`cashback.${status}`);
    }

    translateType(cashbackType: string) {
        switch (cashbackType) {
            case 'real':
                return "Real";
            case 'bonus':
                return this.translateService.instant('geral.bonus');
            default:
                return "";
        }
    }

    setAmountColor(status: string) {
        switch (status) {
            case 'redeemed':
                return "#0C9F19";
            case 'pending':
                return "#6A6868";
            default:
                return "#6A6868";
        }
    }

    formatDateModal(referral_date: string) {
        const date = new Date(referral_date);
        const days_of_week = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        const nomeMes = this.translateService.instant(`data.${months[date.getMonth()]}`).toLowerCase();

        return this.translateService.instant(`data.${days_of_week[date.getDay()]}`) +
            ", " +
            this.translateService.instant('data.diaDeNomeMes', { 'dia': date.getDate(), 'nomeMes': nomeMes });
    }

    createForm() {
        this.form = this.fb.group({
            fromDate: [this.formatDate(this.fromDate, 'us'), Validators.required],
            toDate: [this.formatDate(this.toDate, 'us'), Validators.required],
            status: [''],
        });

        this.submit();
    }

    handleResponse(response: any) {
        this.cashbacks = response;
        this.loading = false;
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.loading = false;
    }

    submit() {
        this.queryParams = this.form.value;

        let dataSeparadas = this.selectedDate.split(" - ");
        this.queryParams.toDate = this.formateDate(dataSeparadas[1]);
        this.queryParams.fromDate = this.formateDate(dataSeparadas[0]);

        this.getCashbacks();
    }

    onDateSelection(date: NgbDate, datepicker: any) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.form.value.fromDate = this.formatDate(date, 'us');
        } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
            this.toDate = date;
            this.form.value.toDate = this.formatDate(date, 'us');
            this.selectedDate = this.formatDate(this.fromDate) + " - " + this.formatDate(date);
            datepicker.close();
        } else {
            this.toDate = null;
            this.form.value.toDate = null;
            this.fromDate = date;
            this.form.value.fromDate = this.formatDate(date, 'us');
        }
    }

    formatDate(date: NgbDate, lang = 'br') {
        if (lang == 'us') {
            return date.year + '-' + String(date.month).padStart(2, '0') + "-" + String(date.day).padStart(2, '0');
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

    formateDate(data: string) {
        let partes = data.split("/");
        let formatedDate = partes[2] + "-" + partes[1] + "-" + partes[0];

        return formatedDate;
    }
}
