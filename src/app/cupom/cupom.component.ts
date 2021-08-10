import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ApostaService, ResultadoService } from './../services';

@Component({
    selector: 'app-cupom',
    templateUrl: 'cupom.component.html',
    styleUrls: ['cupom.component.css']
})
export class CupomComponent implements OnInit, OnDestroy {
    aposta;
    resultados = new Map();
    show = false;
    isExpired = false;
    unsub$ = new Subject();

    constructor(
        private route: ActivatedRoute,
        private apostaService: ApostaService,
        private renderer: Renderer2,
        private el: ElementRef,
        private resultadoService: ResultadoService
    ) { }

    ngOnInit() {
        this.definirAltura();

        this.route.params
            .subscribe((params: any) => {
                if (params['codigo']) {
                    this.apostaService.getApostaByCodigo(params['codigo'])
                        .pipe(
                            switchMap(aposta => {
                                this.aposta = aposta;
                                if (aposta.tipo == 'esportes') {
                                    const jogosApiIds = aposta.itens.map(item => item.jogo_api_id);
                                    const params = {
                                        ids: jogosApiIds
                                    };

                                    return this.resultadoService.getResultados(params, true);
                                }

                                const observable = new Observable(subscriber => {
                                    subscriber.next([]);
                                    subscriber.complete();
                                });

                                return observable;
                            }),
                            takeUntil(this.unsub$)
                        )
                        .subscribe(
                            (resultados: any[]) => {
                                this.isExpired = false;

                                if (this.aposta.tipo == 'esportes') {
                                    if (this.aposta.resultado && (resultados.length == 0)) {
                                        this.isExpired = true;
                                    }
                                }

                                if (!this.isExpired) {
                                    this.resultados.clear();

                                    resultados.forEach(resultado => {
                                        this.resultados.set(resultado.event_id, resultado.resultado);
                                    });

                                    this.show = true;
                                }
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

    definirAltura() {
        const content = this.el.nativeElement.querySelector('#bilhete-reativo');
        this.renderer.setStyle(content, 'height', `${window.innerHeight}px`);
    }
}
