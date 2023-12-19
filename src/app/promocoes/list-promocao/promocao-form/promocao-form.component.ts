import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromocoesService, MessageService } from '../../../services';
import { config } from '../../../shared/config';

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
    exibirImagem;

    constructor(
        private route: ActivatedRoute,
        private promocoesService: PromocoesService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.idPromocao = params['id'];
        });

        this.TIMESTAMP = new Date().getTime();
        this.SLUG = config.SLUG;
        this.getPromocao(this.idPromocao);
    }

    getPromocao(id){
        this.promocoesService.getPromocaoById(id).subscribe((data) => {
            this.promocao = data;

            if (this.promocao && this.promocao.conteudo) {
                this.promocao.conteudo = this.removerCor(this.promocao.conteudo);
            }

            this.showLoadingIndicator = false;
            this.getTamanhoTela()
        }, (error) => this.handleError(error))
    }

    handleError(msg) {
        this.messageService.error(msg);
    }

    getTamanhoTela() {
        const width = window.innerWidth;
    
        if (width <=  740) {
            this.exibirImagem = this.promocao.imagemMobile;
        } else {
            this.exibirImagem = this.promocao.imagemDesktop;
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.getTamanhoTela();
    }

    removerCor(conteudo: string): string {
        return conteudo.replace(/color: rgb\([^)]*\);/g, '');
    }

}
