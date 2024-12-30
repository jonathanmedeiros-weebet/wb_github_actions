import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuracao-limite-perdas-porcentagem-modal',
  templateUrl: './configuracao-limite-perdas-porcentagem-modal.component.html',
  styleUrls: ['./configuracao-limite-perdas-porcentagem-modal.component.css']
})
export class ConfiguracaoLimitePerdasPorcentagemModalComponent {
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
