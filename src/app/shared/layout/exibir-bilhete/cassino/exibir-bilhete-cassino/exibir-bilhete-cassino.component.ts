import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService, MessageService } from 'src/app/services';
import { config } from '../../../../config';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exibir-bilhete-cassino',
  templateUrl: './exibir-bilhete-cassino.component.html',
  styleUrls: ['./exibir-bilhete-cassino.component.css'],
})
export class ExibirBilheteCassinoComponent implements OnInit {
  @Input() aposta: any;
  @Input() playButton: boolean = true;
  unsub$ = new Subject();

  isLoggedIn;

  constructor(
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private messageService: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void { }

  get gameImageUrl(): string {
    return Boolean(this.aposta.gameImageExt) ? 'https://weebet.s3.amazonaws.com/' + config.SLUG + '/img/thumbnails/' + this.aposta.gameID + this.aposta.gameImageExt : `https://wb-assets.com/img/casino/thumbnails/${this.aposta.fornecedor}/${this.aposta.gameID}.png`;
  }

  async copyToClipboard(codigo: string) {
    try {
      await navigator.clipboard.writeText(codigo);
      this.messageService.success(this.translate.instant('compartilhar_aposta.codigoCopiado'));
    } catch (err) {
      this.messageService.error(this.translate.instant('compartilhar_aposta.codigoCopiadoErro'));
    }
  }

  playGame(aposta) {
    this.activeModal.close();
    window.location.href = `/casino/${aposta.fornecedor}/${aposta.gameID}`;
  }

}
