import { Component, OnInit, OnDestroy } from '@angular/core';

import { RegraService, MessageService } from './../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-regras',
    templateUrl: 'regras.component.html'
})

export class RegrasComponent implements OnInit, OnDestroy {
    regras = '';
    unsub$ = new Subject();

    constructor(
        private regraService: RegraService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.regraService.getRegra()
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                regras => this.regras = regras,
                error => this.messageService.error(error)
            );
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }
}
