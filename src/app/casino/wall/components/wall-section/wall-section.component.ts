import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wall-section',
  templateUrl: './wall-section.component.html',
  styleUrls: ['./wall-section.component.css']
})
export class WallSectionComponent {
  @Input() sectionId: string = '';
  @Input() title: string = '';
  @Input() itemsQty: number = 0;
  @Input() seeAllRouterLink: string = '';
  @Output() onSeeAll = new EventEmitter();
  @Output() onLeft = new EventEmitter();
  @Output() onRight = new EventEmitter();

  constructor(private router: Router){}

  get showScroolButton(): boolean {
    return this.itemsQty > 5
  }

  get showSeeAllButton(): boolean {
    return this.itemsQty > 5
  }

  public handleLeft() {
    this.onLeft.emit();
  }

  public handleRight() {
    this.onRight.emit();
  }

  public handleSeeAll() {
    if(Boolean(this.seeAllRouterLink)){
      this.router.navigate([this.seeAllRouterLink]);
      return;
    }

    this.onSeeAll.emit();
  }
}
