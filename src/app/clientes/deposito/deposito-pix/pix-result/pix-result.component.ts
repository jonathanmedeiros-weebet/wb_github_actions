import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from '../../../../shared/services/utils/message.service';
import {Pix} from '../../../../models';

@Component({
    selector: 'app-pix-result',
    templateUrl: './pix-result.component.html',
    styleUrls: ['./pix-result.component.css']
})
export class PixResultComponent implements OnInit {
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
}
