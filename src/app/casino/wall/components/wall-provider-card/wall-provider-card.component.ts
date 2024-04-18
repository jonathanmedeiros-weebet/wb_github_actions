import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fornecedor } from '../../wall.component';

@Component({
  selector: 'app-wall-provider-card',
  templateUrl: './wall-provider-card.component.html',
  styleUrls: ['./wall-provider-card.component.css']
})
export class WallProviderCardComponent {
  @Input() data: Fornecedor;
  @Output() onClick = new EventEmitter();

  public handleClick() {
    this.onClick.emit(this.data.gameFornecedor)
  }
}
