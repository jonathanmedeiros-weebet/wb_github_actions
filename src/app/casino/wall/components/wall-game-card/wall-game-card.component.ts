import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wall-game-card',
  templateUrl: './wall-game-card.component.html',
  styleUrls: ['./wall-game-card.component.css']
})
export class WallGameCardComponent {
  @Input() game: any;
  @Input() blink: string;
  @Input() isDemo: boolean;
  @Input() isLoggedIn: boolean;
  @Input() isCliente: boolean;
  @Input() isCardInline: boolean = true;
  @Output() openModalLogin = new EventEmitter();

  get gameImageUrl(): string {
    return `https://cdn.wee.bet/img/cassino/${this.game.fornecedor}/${this.game.gameID}.png`;
  }

  get routerLinkDemo(): any[] {
    return [`/casino/${this.blink}/play/DEMO`, this.game.gameID, this.game.fornecedor];
  }

  get routerLinkReal(): any[] {
    return [`/casino/${this.blink}/play/REAL`, this.game.gameID, this.game.fornecedor];
  }

  get providerIsPragmatic(): boolean {
    return this.game.fornecedor === 'pragmatic';
  }

  get providerIsSpribe(): boolean {
    return this.game.fornecedor === 'spribe';
  }

  get providerIsSalsa(): boolean {
    return this.game.fornecedor === 'salsa';
  }

  public handleModalLogin() {
    this.openModalLogin.emit();
  }
}
