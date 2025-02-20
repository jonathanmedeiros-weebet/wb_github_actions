import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) {
    this.elementId = this.helperService.guidGenerate();
  }

  public goToMyProfile() {
    //todo: redirecionar para pagina do pefil
    // this.router.navigate[''];
  }
}
