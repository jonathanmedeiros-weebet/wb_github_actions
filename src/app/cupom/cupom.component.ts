import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApostaService } from './../services';

@Component({
    selector: 'app-cupom',
    templateUrl: 'cupom.component.html',
    styleUrls: ['cupom.component.css']
})
export class CupomComponent implements OnInit, OnDestroy {
    aposta;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private apostaService: ApostaService,
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.route.params
            .subscribe((params: any) => {
                if (params['chave']) {
                    this.apostaService.getAposta(params['chave'])
                        .pipe(takeUntil(this.unsub$))
                        .subscribe(
                            aposta => this.aposta = aposta,
                            error => console.log(error)
                        );
                }
            });
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const content = this.el.nativeElement.querySelector('#bilhete-reativo');
        this.renderer.setStyle(content, 'height', `${window.innerHeight}px`);
    }
}
