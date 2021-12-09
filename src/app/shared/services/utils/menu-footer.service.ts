import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private isEsporteSource = new BehaviorSubject<boolean>(true);
    private isDesafioSource = new BehaviorSubject<boolean>(false);
    private isLoteriaSource = new BehaviorSubject<boolean>(false);
    private isAcumuladaoSource = new BehaviorSubject<boolean>(false);
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    private toggleBilheteStatusSource = new BehaviorSubject<boolean>(false);

    isEsporte = this.isEsporteSource.asObservable();
    isDesafio = this.isDesafioSource.asObservable();
    isAcumuladao = this.isAcumuladaoSource.asObservable();
    isLoteria = this.isLoteriaSource.asObservable();
    quantidadeItens = this.quantidadeItensSource.asObservable();
    toggleBilheteStatus = this.toggleBilheteStatusSource.asObservable();
    toggleStatus = false;
    desafio = false;
    acumuladao = false;
    loteria = false;
    esporte = true;

    constructor() {
        this.checkIsEsporte();
    }

    checkIsEsporte() {
        if (this.desafio || this.acumuladao || this.loteria) {
            this.esporte = false;
            this.isEsporteSource.next(false);
        } else {
            this.esporte = true;
            this.isEsporteSource.next(true);
        }
    }

    setIsDesafio(bool: boolean) {
        this.isDesafioSource.next(bool);
        this.desafio = bool;
        this.checkIsEsporte();
    }

    setIsAcumuladao(bool: boolean) {
        this.isAcumuladaoSource.next(bool);
        this.acumuladao = bool;
        this.checkIsEsporte();
    }

    setIsLoteria(bool: boolean) {
        this.isLoteriaSource.next(bool);
        this.loteria = bool;
        this.checkIsEsporte();
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
