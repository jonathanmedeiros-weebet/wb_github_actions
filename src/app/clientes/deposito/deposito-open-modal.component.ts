import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositoComponent } from './deposito.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposito-open-modal',
  template: `<router-outlet></router-outlet>`,
  styles: ['']
})

export class DepositoOpenModalComponent {
  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {
    this.router.navigate(['/']);
    this.modalService.open(DepositoComponent);
  }
}
