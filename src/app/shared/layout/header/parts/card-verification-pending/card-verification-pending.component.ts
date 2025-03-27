import { Component } from '@angular/core';
import { HelperService } from 'src/app/services';

@Component({
  selector: 'app-card-verification-pending',
  templateUrl: './card-verification-pending.component.html',
  styleUrls: ['./card-verification-pending.component.css']
})
export class CardVerificationPendingComponent {
  public elementId: string;
  constructor(
    private helperService: HelperService,
  ) {
    this.elementId = this.helperService.guidGenerate();
  }
}
