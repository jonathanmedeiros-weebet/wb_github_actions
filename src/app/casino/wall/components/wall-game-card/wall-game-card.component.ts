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

  public handleModalLogin() {
    this.openModalLogin.emit();
  }
}
