import { Component, OnDestroy, OnInit } from '@angular/core';
import {CasinoApiService} from '../../shared/services/casino/casino-api.service';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit,OnDestroy {

    websocket = null;
    wsUri = null;
    tableId = null;
    casinoId = null;
    tryToConnect = true;
    rooms = [];

    constructor(
        private casinoApi: CasinoApiService
    ) { }

    ngOnInit(): void {
        let self = this;
        this.casinoApi.getCasinoLiveKey().subscribe(response =>{
            self.connect(response.socket,response.live_token);
        })


    }

    ngOnDestroy(): void {
        this.disconnect()
    }

    updateRoom(data){
        let room = this.rooms.find((obj)=>{
            return obj.tableId === data.tableId
        })
        if(room === undefined){
            this.rooms.push(data)
            console.log(data)
        }else{

            console.log('update room')

            room = data
        }
    }

    // public
    connect(wsUri: string, casinoId : string = null, tableId: string = null) {
        var self = this;
        self.tryToConnect = true;
        self.wsUri = wsUri;
        console.log('connecting to ' + 'wss://' + wsUri + '/ws');
        if(self.websocket !== null && self.websocket.readyState !== 3){
            self.websocket.close();
            console.log('Socket open closing it');
        }
        self.websocket = new WebSocket('wss://' + wsUri + '/ws');
        self.websocket.onopen = function(evt) {
            self.onWsOpen(evt)
        };
        self.websocket.onclose = function(evt) {
            self.onWsClose(evt)
        };
        self.websocket.onmessage = function(evt) {
            self.onWsMessage(evt)
        };
        self.websocket.onerror = function(evt) {
            self.onWsError(evt)
        };
        if (tableId) {
            self.tableId = tableId;
        }
        self.casinoId = casinoId;
    }
    // public
    onMessage(data) {
        let self = this;
        // console.log(data)
        if(data['tableKey']){
            for(let i=0;i<data.tableKey.length;i++){
                self.subscribe(self.casinoId,data['tableKey'][i],'BRL');
            }
        }
        if(data['tableId']){
            // console.log(data)
            this.updateRoom(data)

        }
    }
    // public
    onConnect() {
        console.log('onConnect')
        this.available()
    }
    // public
    disconnect() {
        var self = this;
        self.tryToConnect = false;
        self.websocket.close();
        console.log('Disconnected');
    }
    // public
    subscribe(casinoId,tableId, currency) {
        var subscribeMessage = {
            type : 'subscribe',
            key : tableId,
            casinoId : casinoId,
            currency : currency
        }
        console.log('subscribing' + tableId);

        var self = this;
        // console.log('Subscribing ' + tableId);
        var jsonSub = JSON.stringify(subscribeMessage);
        self.doWsSend(jsonSub);
    }

    // public
    available() {
        var availableMessage = {
            type : 'available',
            casinoId : this.casinoId
        }
        console.log('checking availability');

        var self = this;
        // console.log('Subscribing ' + tableId);
        var jsonSub = JSON.stringify(availableMessage);
        self.doWsSend(jsonSub);
    }

    onWsOpen(evt) {
        var self = this;

        console.log(evt.data);
        if (self.onConnect != null) {
            self.onConnect();
        }

        console.log('Connected to wss server');
        if (self.tableId) {
            self.subscribe(this.casinoId, this.tableId,"BRL")
        }
    }

    onWsClose(evt) {
        console.log("DISCONNECTED");
        var self = this;
        if (self.tryToConnect === true) {
            console.log("RECONNECTING");
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

    onWsError(evt) {
        console.log('ERROR: ' + evt.data);
    }

    ping() {
        var self = this;
        var pingMessage = {
            type : 'ping',
            pingTime : Date.now().toString()
        }
        var jsonSub = JSON.stringify(pingMessage);
        self.doWsSend(jsonSub);
    }

    doWsSend(message) {
        var self = this;
        console.log("SENT: " + message);
        self.websocket.send(message);
    }

}
