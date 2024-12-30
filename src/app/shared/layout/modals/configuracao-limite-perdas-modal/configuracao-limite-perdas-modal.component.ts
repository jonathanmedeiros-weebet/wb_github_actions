import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuracao-limite-perdas-modal',
  templateUrl: './configuracao-limite-perdas-modal.component.html',
  styleUrls: ['./configuracao-limite-perdas-modal.component.css']
})
export class ConfiguracaoLimitePerdasModalComponent {
    @Input() message: string = '';
    constructor(
        public activeModal: NgbActiveModal,
        private router: Router

    ) { }

    back () {
        this.activeModal.close();
    }
    backHome () {
        this.activeModal.close();
        this.router.navigate(['/']);
    }


}
