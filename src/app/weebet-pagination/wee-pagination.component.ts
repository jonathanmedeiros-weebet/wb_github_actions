import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-wee-pagination',
    templateUrl: './wee-pagination.component.html',
    styleUrls: ['./wee-pagination.component.css']
})
export class WeePaginationComponent implements OnInit {
    @Input() totalPages = 1;
    @Input() currentPage = 1;
    @Input() prevText = 'Anterior';
    @Input() nextText = 'Próximo';
    @Output() pageChange = new EventEmitter<number>();

    pages: (number | string)[] = [];

    ngOnInit() {
        this.generatePages();
    }

    generatePages() {
        this.pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            if (
                i === 1 ||
                i === this.totalPages ||
                (i >= this.currentPage - 1 && i <= this.currentPage + 1)
            ) {
                this.pages.push(i);
            } else if (
                (i === 2 && this.currentPage > 4) ||
                (i === this.totalPages - 1 && this.currentPage < this.totalPages - 3)
            ) {
                this.pages.push('...');
            }
        }
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.pageChange.emit(this.currentPage);
            this.generatePages();
        }
    }

    goToPrevious() {
        if (this.currentPage > 1) {
            this.changePage(this.currentPage - 1);
        }
    }

    goToNext() {
        if (this.currentPage < this.totalPages) {
            this.changePage(this.currentPage + 1);
        }
    }
}
