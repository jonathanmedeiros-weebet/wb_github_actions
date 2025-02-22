import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { AuthService, BilheteEsportivoService, JogoService, MessageService, ParametrosLocaisService } from 'src/app/services';
import { config } from 'src/app/shared/config';
import * as sportIds from 'src/app/shared/constants/sports-ids';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bet-sharing-modal',
  templateUrl: './bet-sharing-modal.component.html',
  styleUrls: ['./bet-sharing-modal.component.css']
})
export class BetSharingModalComponent implements OnInit, OnDestroy {
    LOGO = config.LOGO;
    SLUG = config.SLUG;

    @Input() bet;

    unsub$ = new Subject();

    isMobileApp: boolean;
    isMobileScreen: boolean;
    isLoggedIn: boolean;
    isCustomer: boolean;
    isRepeatingBet: boolean;

    liveTicketUrl: string;

    localParametersOptions: any;
    shareModalRef: any;

    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private gameService: JogoService,
        private localParametersService: ParametrosLocaisService,
        private messageService: MessageService,
        private modal: NgbModal,
        private router: Router,
        private sportsTicketService: BilheteEsportivoService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.isMobileScreen = window.innerWidth <= 1024;
        this.isMobileApp = this.authService.isAppMobile();
        this.isLoggedIn = this.authService.isLoggedIn();

        this.liveTicketUrl = `https://${this.SLUG}/bilhete/${this.bet.codigo}`;
        this.liveTicketUrl += this.isMobileApp ? '?origin=app' : '';

        this.localParametersOptions = this.localParametersService.getOpcoes();
    }

    ngOnDestroy(): void {
        this.unsub$.next();
        this.unsub$.complete();
    }

    async shareBetLink(bet) {
        if (navigator.share) {
            navigator.share({
                title: this.translateService.instant('compartilhar_aposta.mensagemTitle'),
                text: this.translateService.instant('compartilhar_aposta.mensagemBody'),
                url: `https://${this.SLUG}/compartilhar-bilhete/${bet.codigo}`
            }).then(() => {
                this.messageService.success(this.translateService.instant('compartilhar_aposta.bilheteCompartilhado'));
            });
        } else {
            this.copyToClipboard(`https://${config.SLUG}/compartilhar-bilhete/${bet.codigo}`, false);
            this.messageService.success(this.translateService.instant('compartilhar_aposta.linkCopiado'));
        }
    }

    public async convertItemToBet(items) {
        try {
            return await this.gameService.convertItemToBet(items);
        } catch (error) {
            this.handleError(error.message);
            return [];
        }
    }

    async repeatBet(bet) {
        this.isRepeatingBet = true;
        const convertedItemToBet = await this.convertItemToBet(bet.itens);

        if (convertedItemToBet.length) {
            this.sportsTicketService.atualizarItens(convertedItemToBet);
            this.activeModal.close();
            this.router.navigate(['/esportes']);
            this.messageService.success(this.translateService.instant('compartilhar_aposta.apostaRepetida'));
            return;
        }

        this.messageService.warning(this.translateService.instant('compartilhar_aposta.apostaRepetidaErro'));
        this.isRepeatingBet = false;
    }

    canRepeatBet(bet) {
        const hasItemWithResult = bet.itens.some((item: any) => item.resultado);

        if (hasItemWithResult || bet.resultado || bet.data_liquidacao) {
            return false;
        }

        return true;
    }

    async copyToClipboard(betCode: string, message: boolean = true) {
        try {
            await navigator.clipboard.writeText(betCode);
            if (message) {
                this.messageService.success(this.translateService.instant('compartilhar_aposta.codigoCopiado'));
            }
        } catch (err) {
            this.messageService.error(this.translateService.instant('compartilhar_aposta.codigoCopiadoErro'));
        }
    }

    getBetResultClasses(betItem: any): any {
        return {
            'ganhou': !betItem.removido ? betItem.resultado === 'ganhou' : false,
            'perdeu': !betItem.removido ? betItem.resultado === 'perdeu' : false,
            'cancelado': betItem.removido,
        };
    }

    getIconBySport(id: number): string {
        switch (id) {
            case sportIds.BETSAPI_FOOTBALL_ID:
            case sportIds.LSPORTS_FOOTBALL_ID:
                return 'wbicon icon-futebol';
            case sportIds.BETSAPI_BOXING_ID:
            case sportIds.LSPORTS_BOXING_ID:
                return 'wbicon icon-luta';
            case sportIds.BETSAPI_AMERICAN_FOOTBALL_ID:
                return 'wbicon icon-futebol-americano';
            case sportIds.BETSAPI_TABLE_TENNIS_ID:
            case sportIds.BETSAPI_TENNIS_ID:
            case sportIds.LSPORTS_TENNIS_ID:
                return 'wbicon icon-tenis';
            case sportIds.BETSAPI_ICE_HOCKEY_ID:
                return 'wbicon icon-hoquei-no-gelo';
            case sportIds.BETSAPI_BASKETBALL_ID:
            case sportIds.LSPORTS_BASKETBALL_ID:
                return 'wbicon icon-basquete';
            case sportIds.BETSAPI_FUTSAL_ID:
                return 'wbicon icon-futsal';
            case sportIds.BETSAPI_VOLLEYBALL_ID:
            case sportIds.LSPORTS_VOLLEYBALL_ID:
                return 'wbicon icon-volei';
            case sportIds.BETSAPI_E_SPORTS_ID:
                return 'wbicon icon-e-sports';
            default:
                return 'wbicon icon-futebol';
        }
    }

    handleError(message: string) {
        this.messageService.error(message);
    }
}
