import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wall-search-bar',
  templateUrl: './wall-search-bar.component.html',
  styleUrls: ['./wall-search-bar.component.css']
})
export class WallSearchBarComponent {
  @Input() term: string = '';
  @Input() placeholder: string = '';
  @Output() onFocusIn = new EventEmitter();
  @Output() onFocusOut = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() onClear = new EventEmitter();
  
  public handleSearch($event) {
    this.onSearch.emit($event);
  }

  public handleFocusIn() {
    this.onFocusIn.emit();
  }

  public handleFocusOut() {
    this.onFocusOut.emit();
  }

  public handleClear() {
    this.onClear.emit();
  }
}
