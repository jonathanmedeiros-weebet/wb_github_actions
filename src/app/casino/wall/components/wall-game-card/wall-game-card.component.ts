import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wall-game-card',
  templateUrl: './wall-game-card.component.html',
  styleUrls: ['./wall-game-card.component.scss']
})
export class WallGameCardComponent {
  @Input() game: any;
  @Input() blink: string;
  @Input() isDemo: boolean;
  @Input() isLoggedIn: boolean;
  @Input() isCliente: boolean;
  @Input() cardType: 'filter' | 'default' | 'inline' = 'default';
  @Output() openModalLogin = new EventEmitter();

  get gameImageUrl(): string {
    return `https://cdn.wee.bet/img/cassino/${this.game.fornecedor}/${this.game.gameID}.png`;
  }

  get routerLinkDemo(): any[] {
    return [`/${this.blink}/`, this.game.fornecedor, this.game.gameID, 'DEMO'];
  }

  get routerLinkReal(): any[] {
      return [`/${this.blink}/`, this.game.fornecedor, this.game.gameID];
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

  get isCardInline(): boolean {
    return this.cardType === 'inline';
  }

  get isCardDefault(): boolean {
    return this.cardType === 'default';
  }

  get isCardFilter(): boolean {
    return this.cardType === 'filter';
  }

  public handleModalLogin() {
    this.openModalLogin.emit();
  }
}
