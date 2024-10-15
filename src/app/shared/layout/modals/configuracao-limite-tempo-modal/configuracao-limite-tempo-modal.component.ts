import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-configuracao-limite-tempo-modal',
  templateUrl: './configuracao-limite-tempo-modal.component.html',
  styleUrls: ['./configuracao-limite-tempo-modal.component.css']
})
export class ConfiguracaoLimiteTempoModalComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private auth: AuthService
  ) { }

  back () {
    this.activeModal.close();
  }

  logout() {
    this.auth.logout();
  }
}
