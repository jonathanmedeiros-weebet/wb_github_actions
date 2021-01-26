import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
                if (params['chave']) {
                    this.apostaService.getAposta(params['chave'])
                        .pipe(
                            switchMap(aposta => {
                                this.aposta = aposta;
                                const jogosApiIds = aposta.itens.map(item => item.jogo_api_id);
                                const params = {
                                    ids: jogosApiIds
                                };

                                return this.resultadoService.getResultados(params, true)
                            }),
                            takeUntil(this.unsub$)
                        )
                        .subscribe(
                            resultados => {
                                this.resultados.clear();

                                resultados.forEach(resultado => {
                                    this.resultados.set(resultado.event_id, resultado.resultado);
                                });

                                this.show = true;
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
