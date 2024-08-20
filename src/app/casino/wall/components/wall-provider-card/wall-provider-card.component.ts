import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fornecedor } from '../../wall.component';

@Component({
  selector: 'app-wall-provider-card',
  templateUrl: './wall-provider-card.component.html',
  styleUrls: ['./wall-provider-card.component.css']
})
export class WallProviderCardComponent {
  @Input() container: any;
  @Input() data: Fornecedor;
  @Input() selected: boolean = false;
  @Input() type: 'inline' | 'filter' = 'inline';
  @Output() onClick = new EventEmitter();

  get cardInline(): boolean {
    return this.type === 'inline';
  }

  get cardFilter(): boolean {
    return this.type === 'filter';
  }

  public handleClick() {
    this.onClick.emit(this.data.gameFornecedor)
    if(this.container){
      this.container.scrollTop = 0;
    }
  }
}
