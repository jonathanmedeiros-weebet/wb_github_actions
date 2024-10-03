import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService, MessageService } from 'src/app/services';
import { config } from '../../../../config';

@Component({
  selector: 'app-exibir-bilhete-cassino',
  templateUrl: './exibir-bilhete-cassino.component.html',
  styleUrls: ['./exibir-bilhete-cassino.component.css'],
})
export class ExibirBilheteCassinoComponent implements OnInit {
  @Input() aposta: any;
  @Input() playButton: boolean = false;
  unsub$ = new Subject();

  isLoggedIn;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void { }

  get gameImageUrl(): string {
    return Boolean(this.aposta.gameImageExt) ? 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/img/thumbnails/' + this.aposta.gameID + this.aposta.gameImageExt : `https://cdn.wee.bet/img/casino/thumbnails/${this.aposta.fornecedor}/${this.aposta.gameID}.png`;
  }

  async copyToClipboard(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo);
      this.messageService.success('Código copiado para a área de transferência!');
    } catch (err) {
      this.messageService.error('Falha ao copiar o código para a área de transferência.');
    }
  }

}
