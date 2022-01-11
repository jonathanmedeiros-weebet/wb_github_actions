import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private isEsporteSource = new BehaviorSubject<boolean>(true);
    private isPaginaSource = new BehaviorSubject<boolean>(false);
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    private toggleBilheteStatusSource = new BehaviorSubject<boolean>(false);

    isEsporte = this.isEsporteSource.asObservable();
    isPagina = this.isPaginaSource.asObservable();
    quantidadeItens = this.quantidadeItensSource.asObservable();
    toggleBilheteStatus = this.toggleBilheteStatusSource.asObservable();

    toggleStatus = false;
    acumuladao = false;
    esporte = true;
    outraModalidade = false;

    constructor() {
        this.checkIsEsporte();
    }

    checkIsEsporte() {
        if (this.outraModalidade || this.acumuladao) {
            this.esporte = false;
            this.setIsEsporte(false);
        } else {
            this.esporte = true;
            this.setIsEsporte(true);
        }
    }

    setIsEsporte(bool: boolean) {
        this.isEsporteSource.next(bool);
    }

    setIsPagina(bool: boolean) {
        this.isPaginaSource.next(bool);
    }

    setIsAcumuladao(bool: boolean) {
        this.acumuladao = bool;
        this.checkIsEsporte();
    }

    getIsAcumuladao() {
        return this.acumuladao;
    }

    setOutraModalidade(bool: boolean) {
        this.outraModalidade = bool;
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
