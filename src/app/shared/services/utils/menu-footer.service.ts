import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuFooterService {
    private modalidade = 'esporte';
    private quantidadeItensSource = new BehaviorSubject<number>(0);
    quantidadeItens = this.quantidadeItensSource.asObservable();

    // Bilhetes
    esportivo = false;
    desafio = false;
    acumuladao = false;
    seninha = false;
    quininha = false;
    private toggleBilheteEsportivoSource = new BehaviorSubject<boolean>(false);
    private toggleBilheteDesafioSource = new BehaviorSubject<boolean>(false);
    private toggleBilheteAcumuladaoSource = new BehaviorSubject<boolean>(false);
    private toggleBilheteSeninhaSource = new BehaviorSubject<boolean>(false);
    private toggleBilheteQuininhaSource = new BehaviorSubject<boolean>(false);
    toggleBilheteEsportivo = this.toggleBilheteEsportivoSource.asObservable();
    toggleBilheteDesafio = this.toggleBilheteDesafioSource.asObservable();
    toggleBilheteAcumuladao = this.toggleBilheteAcumuladaoSource.asObservable();
    toggleBilheteSeninha = this.toggleBilheteSeninhaSource.asObservable();
    toggleBilheteQuininha = this.toggleBilheteQuininhaSource.asObservable();

    constructor() {
    }

    setModalidade(modalidade) {
        this.modalidade = modalidade;
    }

    atualizarQuantidade(quantidade) {
        this.quantidadeItensSource.next(quantidade);
    }

    toggleBilhete() {
        switch (this.modalidade) {
            case 'esporte':
                this.esportivo = !this.esportivo;
                this.toggleBilheteEsportivoSource.next(this.esportivo);
                break;
            case 'desafio':
                this.desafio = !this.desafio;
                this.toggleBilheteDesafioSource.next(this.desafio);
                break;
            case 'acumuladao':
                this.acumuladao = !this.acumuladao;
                this.toggleBilheteAcumuladaoSource.next(this.acumuladao);
                break;
            case 'seninha':
                this.seninha = !this.seninha;
                this.toggleBilheteSeninhaSource.next(this.seninha);
                break;
            case 'quininha':
                this.quininha = !this.quininha;
                this.toggleBilheteQuininhaSource.next(this.quininha);
                break;
        }
    }
}
