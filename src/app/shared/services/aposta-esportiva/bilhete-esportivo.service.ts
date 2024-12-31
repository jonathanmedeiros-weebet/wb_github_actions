import { Injectable } from '@angular/core';

import { ItemBilheteEsportivo } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import {MenuFooterService} from '../utils/menu-footer.service';
import { ParametrosLocaisService } from '../parametros-locais.service';
import { MessageService } from '../utils/message.service';

@Injectable({
    providedIn: 'root'
})
export class BilheteEsportivoService {
    private itensSource = new BehaviorSubject<ItemBilheteEsportivo[]>([]);
    itensAtuais = this.itensSource.asObservable();
    bilheteIsOpen = false;
    private openBilheteSource = new BehaviorSubject<boolean>(false);
    openBilhete = this.openBilheteSource.asObservable();
    private idJogoSource = new BehaviorSubject(0);
    idJogo = this.idJogoSource.asObservable();
    private sportIdSource = new BehaviorSubject(0);
    sportId = this.sportIdSource.asObservable();

    constructor(
        private menuFooterService: MenuFooterService,
        private messageService: MessageService,
        private paramsService: ParametrosLocaisService
    ) {
        const itens = this.getItens();

        if (itens) {
            this.atualizarItens(itens);
        }
    }

    atualizarItens(itens): void {
        let maxItems = this.paramsService.getOpcoes().quantidade_max_jogos_bilhete;

        if (itens.length > maxItems) {
            let oldItems = this.getItens();
            this.messageService.warning(`Por favor, inclua no MÁXIMO ${maxItems} eventos.`);

            this.menuFooterService.atualizarQuantidade(oldItems.length);
            this.itensSource.next(oldItems);
        } else {
            const itensSerializado = JSON.stringify(itens);
            localStorage.setItem('itens-bilhete-esportivo', itensSerializado);

            this.menuFooterService.atualizarQuantidade(itens.length);
            this.itensSource.next(itens);
        }
    }

    getItens() {
        return JSON.parse(localStorage.getItem('itens-bilhete-esportivo'));
    }

    toggleBilhete() {
        this.bilheteIsOpen = !this.bilheteIsOpen;
        this.openBilheteSource.next(this.bilheteIsOpen);
    }

    sendId(idJogo) {
        this.idJogoSource.next(idJogo)
    }

    setSportId(id:number) {
        this.sportIdSource.next(id);
    }
}
