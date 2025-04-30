import { Component, Input, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../base-form/base-form.component';
import { config } from 'src/app/shared/config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, MessageService } from 'src/app/services';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-multifactor-confirmation-modal',
  templateUrl: './multifactor-confirmation-modal.component.html',
  styleUrls: ['./multifactor-confirmation-modal.component.css']
})
export class MultifactorConfirmationModalComponent extends BaseFormComponent implements OnInit {
  @Input() tokenMultifator: string;
  public logo: string = config.LOGO;
  public submitting = false;

  constructor(
    private activeModal: NgbActiveModal,
    private auth: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    super();
  }

  get isMobile(): boolean {
    return window.innerWidth <= 1025;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({codigo: [null, Validators.required]});
  }

  submit() {
    const values = {
      ...this.form.value,
      token: this.tokenMultifator
    }
    this.submitting = true;

    this.auth.validarMultifator(values)
      .subscribe(res => {
        if (res && res.status === 'checked') {
          this.activeModal.close({
            checked: true,
            token: this.tokenMultifator,
            codigo: values.codigo
          });
        }
      }, error => {
        this.handleError(error);
      });
  }

  cancelar() {
      this.activeModal.dismiss('cancelado');
  }

  handleError(error: string) {
      this.messageService.error(error);
      this.submitting = false;
  }
}
