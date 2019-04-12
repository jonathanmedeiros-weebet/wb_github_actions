import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApostaEsportivaService } from './../services';

@Component({
    selector: 'app-bilhete',
    templateUrl: 'bilhete.component.html',
    styleUrls: ['bilhete.component.css']
})
export class BilheteComponent implements OnInit, OnDestroy {
    aposta;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private apostaEsportivaService: ApostaEsportivaService
    ) { }

    ngOnInit() {
        this.route.params
            .subscribe((params: any) => {
                if (params['id']) {
                    const id = +params['id'];

                    this.apostaEsportivaService.getAposta(id)
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            apostaEsportiva => {
                                console.log(apostaEsportiva);
                                this.aposta = apostaEsportiva;
                            },
                            error => console.log(error)
                        );
                }
            });

    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }
}
