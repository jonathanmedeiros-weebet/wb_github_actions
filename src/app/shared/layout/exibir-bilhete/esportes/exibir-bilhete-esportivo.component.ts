import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { config } from './../../../config';
import {
    ParametrosLocaisService, PrintService,
    AuthService, UtilsService, MessageService
} from '../../../../services';
import moment from 'moment';
import { ApostaEsportiva, ItemApostaEsportiva} from '../../../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompatilhamentoBilheteModal } from '../../modals';
import * as sportsIds from '../../../constants/sports-ids';
let newNavigator: any;
newNavigator = window.navigator;

@Component({
    selector: 'app-exibir-bilhete-esportivo',
    templateUrl: 'exibir-bilhete-esportivo.component.html',
    styleUrls: ['exibir-bilhete-esportivo.component.css']
})

export class ExibirBilheteEsportivoComponent implements OnInit {
    @ViewChild('bilheteCompartilhamento', { static: false }) bilheteCompartilhamento;
    @Input() aposta: any;
    LOGO = config.LOGO;
    opcoes;
    cambistaPaga;
    enabledBookie;
    appMobile;
    isCliente;
    isLoggedIn;
    modalCompartilhamentoRef;

    constructor(
        private paramsService: ParametrosLocaisService,
        private printService: PrintService,
        private utilsService: UtilsService,
        private messageService: MessageService,
        private auth: AuthService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
        this.opcoes = this.paramsService.getOpcoes();
        this.enabledBookie = this.opcoes.modo_cambista;
        this.auth.logado
            .subscribe(
                isLoggedIn => {
                    this.isLoggedIn = isLoggedIn;
                }
            );

        this.auth.cliente
            .subscribe(
                isCliente => {
                    this.isCliente = isCliente;
                }
            );

        if (this.aposta.passador.percentualPremio > 0) {
            if (this.aposta.resultado) {
                this.cambistaPaga = this.aposta.premio * ((100 - this.aposta.passador.percentualPremio) / 100);
            } else {
                this.cambistaPaga = this.aposta.possibilidade_ganho * ((100 - this.aposta.passador.percentualPremio) / 100);
            }
        }

        const itensOrdenados = this.ordenarApostaItensPorData(this.aposta);
        this.aposta.itens = itensOrdenados;
    }

    resultadoClass(item) {
        return {
            'ganhou': !item.removido ? item.resultado === 'ganhou' : false,
            'perdeu': !item.removido ? item.resultado === 'perdeu' : false,
            'cancelado': item.removido,
            'encerrado': item.encerrado
        };
    }

    shared() {
        if (this.appMobile) {
            this.modalCompartilhamentoRef = this.modalService.open(CompatilhamentoBilheteModal,{
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-pop-up',
                centered: true,
                animation: true,
                backdrop: 'static',
            });
            this.modalCompartilhamentoRef.result.then(
                (result) => {
                    switch (result) {
                        case 'imagem':
                            this.bilheteCompartilhamento.shared(true);
                            break;
                        case 'link':
                        default:
                            this.bilheteCompartilhamento.shared(false);
                            break;
                    }
                },
                (reason) => { }
            );
        } else {
            this.bilheteCompartilhamento.shared(false);
        }
    }

    print() {
        this.utilsService.getDateTime().subscribe(
            results => {
                const { currentDateTime } = results;
                const dateTime = moment(currentDateTime).format('DD/MM/YYYY [as] HH:mm');
                this.printService.sportsTicket(this.aposta, dateTime);
            },
            error => {
                this.handleError(error);
            }
        );
    }

    sportIcon(sportId) {
            let className = 'icon-futebol wbicon';
    
            switch (sportId) {
                case sportsIds.BETSAPI_FOOTBALL_ID:
                case sportsIds.LSPORTS_FOOTBALL_ID: {
                    className = 'wbicon icon-futebol';
                    break;
                }
                case sportsIds.BETSAPI_BOXING_ID:
                case sportsIds.LSPORTS_BOXING_ID: {
                    className = 'wbicon icon-luta';
                    break;
                }
                case sportsIds.BETSAPI_AMERICAN_FOOTBALL_ID: {
                    className = 'wbicon icon-futebol-americano';
                    break;
                }
                case sportsIds.BETSAPI_TABLE_TENNIS_ID:
                case sportsIds.BETSAPI_TENNIS_ID:
                case sportsIds.LSPORTS_TENNIS_ID: {
                    className = 'wbicon icon-tenis';
                    break;
                }
                case sportsIds.BETSAPI_ICE_HOCKEY_ID: {
                    className = 'wbicon icon-hoquei-no-gelo';
                    break;
                }
                case sportsIds.BETSAPI_BASKETBALL_ID:
                case sportsIds.LSPORTS_BASKETBALL_ID: {
                    className = 'wbicon icon-basquete';
                    break;
                }
                case sportsIds.BETSAPI_FUTSAL_ID: {
                    className = 'wbicon icon-futsal';
                    break;
                }
                case sportsIds.BETSAPI_VOLLEYBALL_ID:
                case sportsIds.LSPORTS_VOLLEYBALL_ID: {
                    className = 'wbicon icon-volei';
                    break;
                }
                case sportsIds.BETSAPI_E_SPORTS_ID: {
                    className = 'wbicon icon-e-sports';
                    break;
                }
            }
    
            return className;
        }

    handleError(msg) {
        this.messageService.error(msg);
    }

    private ordenarApostaItensPorData(aposta: ApostaEsportiva): Array<ItemApostaEsportiva> {
        let itensOrdenados;
        itensOrdenados = aposta.itens.sort((a,b) => moment(a.jogo_horario).toDate().getTime() - moment(b.jogo_horario).toDate().getTime());
        return itensOrdenados;
    }
}
