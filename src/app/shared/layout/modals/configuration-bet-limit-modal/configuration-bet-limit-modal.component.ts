import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuration-bet-limit-modal',
  templateUrl: './configuration-bet-limit-modal.component.html',
  styleUrls: ['./configuration-bet-limit-modal.component.css']
})
export class ConfigurationBetLimitModalComponent {
  @Input() message: string = '';
  @Input() betLimitHit: boolean = true;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  back() {
    this.activeModal.close();
  }

  backHome() {
    this.activeModal.close();
    this.router.navigate(['/']);
  }
}
