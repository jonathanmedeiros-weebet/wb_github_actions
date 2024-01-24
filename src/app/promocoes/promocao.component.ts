import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService, PromocoesService, LayoutService } from '../services';
import { Router } from '@angular/router';
import { config } from '../shared/config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-promocao',
  templateUrl: './promocao.component.html',
  styleUrls: ['./promocao.component.css']
})
export class PromocaoComponent implements OnInit {
    promocoes: any;
    isLoading = true;
    TIMESTAMP;
    SLUG;
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    unsub$ = new Subject();

    constructor(
        private promocoesService: PromocoesService,
        private messageService: MessageService,
        private router: Router,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.getPromocoes()
        this.TIMESTAMP = new Date().getTime();
        this.SLUG = config.SLUG;

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.currentHeight = window.innerHeight - this.headerHeight;
                this.cd.detectChanges();
            });
    }

    getPromocoes(){
        this.promocoesService.getPromocoes().subscribe((data) => {
            this.promocoes = data;
            this.isLoading = false;
        }, (error) => this.handleError(error))
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    goToDetails(id: any, verify: boolean) {
        if (!verify || this.isClickable()) {
          this.router.navigate([`promocao/list/${id}`]);
        }
    }

    isClickable(): boolean {
        return window.innerWidth <= 768;
    }
}
