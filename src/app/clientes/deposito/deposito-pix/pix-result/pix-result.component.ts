import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {timeout} from 'rxjs/operators';

@Component({
    selector: 'app-pix-result',
    templateUrl: './pix-result.component.html',
    styleUrls: ['./pix-result.component.css']
})
export class PixResultComponent implements OnInit {
    @Input() pix;
    @Output() onFinish = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

}
