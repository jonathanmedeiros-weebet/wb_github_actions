import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromocoesService, MessageService, LayoutService } from '../../../services';
import { config } from '../../../shared/config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-promocao-form',
  templateUrl: './promocao-form.component.html',
  styleUrls: ['./promocao-form.component.css']
})

export class PromocaoFormComponent implements OnInit {
    promocao: any;
    idPromocao = null;
    showLoadingIndicator = true;
    TIMESTAMP;
    SLUG;
    headerHeight = 92;
    currentHeight = window.innerHeight - this.headerHeight;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private promocoesService: PromocoesService,
        private messageService: MessageService,
        private layoutService: LayoutService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.idPromocao = params['id'];
        });

        this.TIMESTAMP = new Date().getTime();
        this.SLUG = config.SLUG;
        this.getPromocao(this.idPromocao);

        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.currentHeight = window.innerHeight - this.headerHeight;
                this.cd.detectChanges();
            });
    }

    getPromocao(id){
        this.promocoesService.getPromocaoById(id).subscribe((data) => {
            this.promocao = data;

            if (this.promocao && this.promocao.conteudo) {
                this.promocao.conteudo = this.removerCor(this.promocao.conteudo);
            }

            this.showLoadingIndicator = false;
        }, (error) => this.handleError(error))
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    removerCor(conteudo) {
        var padrao = /style="color:\s*[^"]*"/g;
        var conteudoModificado = conteudo.replace(padrao, 'style="color: var(--foreground-sidebars)"');
        
        return conteudoModificado;
    }
}
