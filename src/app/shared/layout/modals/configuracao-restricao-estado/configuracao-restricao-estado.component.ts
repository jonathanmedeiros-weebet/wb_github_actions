import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configuracao-restricao-estado',
  templateUrl: './configuracao-restricao-estado.component.html',
  styleUrls: ['./configuracao-restricao-estado.component.css']
})
export class ConfiguracaoRestricaoEstadoComponent {
    // @Input() message: string = '';
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
