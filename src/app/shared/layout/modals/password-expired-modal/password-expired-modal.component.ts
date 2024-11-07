import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteSenhaModalComponent } from '../cliente-senha-modal/cliente-senha-modal.component';

@Component({
  selector: 'app-password-expired-modal',
  templateUrl: './password-expired-modal.component.html',
  styleUrls: ['./password-expired-modal.component.css']
})
export class PasswordExpiredModalComponent {
  @Input() data: any;
  passwordExpired: boolean
  daysRemaining;
  isMobile;

  constructor (
    private activeModal: NgbActiveModal,
    private router: Router,
    private modalService: NgbModal
  ){ }

  ngOnInit(): void {
    this.passwordExpired = this.data.expired;
    this.daysRemaining = this.data.daysRemaining;
    this.isMobile = window.innerWidth <= 1024;

    const rememberLater = localStorage.getItem('rememberLater')
    if (rememberLater && !this.passwordExpired 
      && this.daysRemaining == rememberLater) {
      this.activeModal.dismiss()
    }
  }

  changePassword() {
    this.activeModal.dismiss();
    if (this.isMobile) {
      this.modalService.open(ClienteSenhaModalComponent, {windowClass: 'd-none-alterar-senha d-block-header-alterar-senha'})
    } else {
      this.router.navigate(['/alterar-senha'])
    }
  }

  remembeMerLater() {
    this.activeModal.dismiss();
    localStorage.setItem('rememberLater', String(this.daysRemaining))
  }
}
