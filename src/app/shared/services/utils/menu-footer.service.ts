import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private modalidadeSource = new BehaviorSubject<string>('esporte');
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    private toggleBilheteStatusSource = new BehaviorSubject<boolean>(false);

    toggleStatus = false;
    quantidadeItens = this.quantidadeItensSource.asObservable();
    toggleBilheteStatus = this.toggleBilheteStatusSource.asObservable();
    modalidade = this.modalidadeSource.asObservable();

    constructor() {
    }

    setModalidade(modalidade) {
        this.toggleBilheteStatusSource.next(false);
        this.toggleStatus = false;
        this.modalidadeSource.next(modalidade);
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
