import { Component, OnInit } from '@angular/core';
import { MessageService, PromocoesService } from '../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promocao',
  templateUrl: './promocao.component.html',
  styleUrls: ['./promocao.component.css']
})
export class PromocaoComponent implements OnInit {
    promocoes: any;
    isLoading = true;

    constructor(
        private promocoesService: PromocoesService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getPromocoes()
    }

    getPromocoes(){
        this.promocoesService.getPromocoes().subscribe((data) => {
            this.promocoes = data;
            this.isLoading = false;
            console.log('Promocções: ', this.promocoes);
        }, (error) => this.handleError(error))
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    goTo() {
        this.router.navigate(['promocao/list/2']);
        // this.router.navigate(['list', id], { relativeTo: this.route });
    }
      
}
