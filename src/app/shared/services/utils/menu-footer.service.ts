import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private modalidadeSource = new BehaviorSubject<string>('esporte');
    modalidade = this.modalidadeSource.asObservable();
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    quantidadeItens = this.quantidadeItensSource.asObservable();

    constructor() {
    }

    atualizarModalidade(modalidade) {
        this.modalidadeSource.next(modalidade);
    }

    atualizarQuantidade(quantidade) {
        this.quantidadeItensSource.next(quantidade);
    }
}
