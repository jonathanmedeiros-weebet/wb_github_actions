import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from '../../../../shared/services/utils/message.service';
import {Pix} from '../../../../models';

@Component({
    selector: 'app-deposito-pix-result',
    templateUrl: './deposito-pix-result.component.html',
    styleUrls: ['./deposito-pix-result.component.css']
})
export class DepositoPixResultComponent implements OnInit {
    @Input() pix: Pix;
    @Output() onFinish = new EventEmitter();

    constructor(
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
    }

    copyInputMessage(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.messageService.success('QRCode copiado para área de transferência');
    }

    resetarPix() {
        this.onFinish.emit();
    }
}
