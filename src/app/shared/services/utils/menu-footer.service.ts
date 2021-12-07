import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private modalidade = 'esporte';
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    private toggleBilheteStatusSource = new BehaviorSubject<boolean>(false);

    toggleStatus = false;
    quantidadeItens = this.quantidadeItensSource.asObservable();
    toggleBilheteStatus = this.toggleBilheteStatusSource.asObservable();

    constructor() {
    }

    setModalidade(modalidade) {
        this.toggleBilheteStatusSource.next(false);
        this.toggleStatus = false;
        this.modalidade = modalidade;
    }

    getModalidade() {
        return this.modalidade;
    }

    atualizarQuantidade(quantidade) {
        this.quantidadeItensSource.next(quantidade);
    }

    toggleBilhete(status?) {
        if (status != null) {
            this.toggleStatus = status;
        } else {
            this.toggleStatus = !this.toggleStatus;
        }
        this.toggleBilheteStatusSource.next(this.toggleStatus);
    }
}
