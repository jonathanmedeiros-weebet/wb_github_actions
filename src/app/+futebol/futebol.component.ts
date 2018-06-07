import { Component, OnInit } from '@angular/core';

import {  MessageService} from '../services';
import { } from '../models';

import * as _ from 'lodash';
import * as clone from 'clone';

@Component({
    selector: 'app-futebol',
    templateUrl: 'futebol.component.html',
    styleUrls: ['futebol.component.css']
})
export class FutebolComponent implements OnInit {

    constructor(
        private messageService: MessageService
    ) { }

    ngOnInit() {

    }


    success(msg) {
        this.messageService.success(msg);
    }

    handleError(msg) {
        this.messageService.error(msg);
    }
}
