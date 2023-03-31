import { Component, OnInit, Input} from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-informativo-modal',
  templateUrl: './informativo-modal.component.html',
  styleUrls: ['./informativo-modal.component.css']
})
export class InformativoModalComponent implements OnInit {
	@Input() movimentacao;
	descricao;
	
	constructor(
		public activeModal: NgbActiveModal,
	) { }

    ngOnInit(): void {
      this.descricao = this.movimentacao['descricao'];
    }

    cancel() {
        this.activeModal.close('cancel');
    }

    setPagamento() {
        this.activeModal.close('pagamento');
    }
}
