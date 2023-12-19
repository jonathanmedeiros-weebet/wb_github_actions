import { Component, OnInit } from '@angular/core';
import { MessageService, PromocoesService } from '../services';
import { Router } from '@angular/router';
import { config } from '../shared/config';
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

    constructor(
        private promocoesService: PromocoesService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getPromocoes()
        this.TIMESTAMP = new Date().getTime();
        this.SLUG = config.SLUG;
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
