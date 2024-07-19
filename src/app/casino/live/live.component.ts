import { Component, OnDestroy, OnInit } from '@angular/core';
import { CasinoApiService } from '../../shared/services/casino/casino-api.service';
import { AuthService, ParametrosLocaisService } from './../../services';
import { interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../shared/layout/modals';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

    websocket = null;
    wsUri = null;
    tableId = null;
    casinoId = null;
    tryToConnect = true;
    rooms = [];
    isCliente;
    isLoggedIn;
    showLoadingIndicator = true;
    modalRef;

    blink: string;

    constructor(
        private casinoApi: CasinoApiService,
        private auth: AuthService,
        private modalService: NgbModal,
        private router: Router,
        private paramsService: ParametrosLocaisService,
        private translate: TranslateService
    ) {
    }

    get customLiveCasinoName(): string {
        return this.paramsService.getCustomCasinoName(
            this.translate.instant('cassino.aoVivo'),
            this.translate.instant('geral.cassino').toUpperCase()
        );
    }

    ngOnInit(): void {
        this.blink = this.router.url.split('/')[2];
        let self = this;
        this.casinoApi.getCasinoLiveKey().subscribe(response => {
            self.connect(response.socket, response.live_token);
            interval(1000)
                .subscribe(() => {
                    this.showLoadingIndicator = false;
                });
        });

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

    }

    ngOnDestroy(): void {
        this.disconnect();
    }

    updateRoom(data) {
        let room = this.rooms.find((obj) => {
            return obj.tableId === data.tableId;
        });
        if (room === undefined) {
            this.rooms.push(data);
        } else {
            room = data;
        }
    }

    // public
    connect(wsUri: string, casinoId: string = null, tableId: string = null) {
        var self = this;
        self.tryToConnect = true;
        self.wsUri = wsUri;
        if (self.websocket !== null && self.websocket.readyState !== 3) {
            self.websocket.close();
        }
        self.websocket = new WebSocket('wss://' + wsUri + '/ws');
        self.websocket.onopen = function(evt) {
            self.onWsOpen(evt);
        };
        self.websocket.onclose = function(evt) {
            self.onWsClose(evt);
        };
        self.websocket.onmessage = function(evt) {
            self.onWsMessage(evt);
        };
        if (tableId) {
            self.tableId = tableId;
        }
        self.casinoId = casinoId;
    }

    // public
    onMessage(data) {
        let self = this;
        if (data['tableKey']) {
            for (let i = 0; i < data.tableKey.length; i++) {
                self.subscribe(self.casinoId, data['tableKey'][i], 'BRL');
            }
        }
        if (data['tableId']) {
            this.updateRoom(data);
        }
    }

    // public
    onConnect() {
        this.available();
    }

    // public
    disconnect() {
        var self = this;
        self.tryToConnect = false;
        self.websocket.close();
    }

    // public
    subscribe(casinoId, tableId, currency) {
        var subscribeMessage = {
            type: 'subscribe',
            key: tableId,
            casinoId: casinoId,
            currency: currency
        };
        var self = this;
        var jsonSub = JSON.stringify(subscribeMessage);
        self.doWsSend(jsonSub);
    }

    // public
    available() {
        var availableMessage = {
            type: 'available',
            casinoId: this.casinoId
        };

        var self = this;
        var jsonSub = JSON.stringify(availableMessage);
        self.doWsSend(jsonSub);
    }

    onWsOpen(evt) {
        var self = this;

        if (self.onConnect != null) {
            self.onConnect();
        }

        if (self.tableId) {
            self.subscribe(this.casinoId, this.tableId, 'BRL');
        }
    }

    onWsClose(evt) {
        var self = this;
        if (self.tryToConnect === true) {
            self.connect(self.wsUri, self.casinoId, self.tableId);
        }
    }

    onWsMessage(evt) {
        var self = this;
        var data = JSON.parse(evt.data);
        if (self.onMessage != null) {
            self.onMessage(data);
        }
    }

    ping() {
        var self = this;
        var pingMessage = {
            type: 'ping',
            pingTime: Date.now().toString()
        };
        var jsonSub = JSON.stringify(pingMessage);
        self.doWsSend(jsonSub);
    }

    doWsSend(message) {
        var self = this;
        self.websocket.send(message);
    }
    abrirModalLogin() {
        this.modalRef = this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                centered: true,
                windowClass: 'modal-550 modal-h-350 modal-login',
            }
        );

        this.modalRef.result
            .then(
                result => {
                },
                reason => {
                }
            );
    }

}
