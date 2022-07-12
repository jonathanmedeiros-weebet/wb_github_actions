import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {SidebarService} from '../../services/utils/sidebar.service';

import * as random from 'lodash.random';
import {SupresinhaService} from '../../services/utils/surpresinha.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-sidebar-nav',
    templateUrl: './sidebar-nav.component.html',
    styleUrls: ['./sidebar-nav.component.css']
})
export class SidebarNavComponent implements OnInit {
    @Input() height;
    contexto;
    esporte = '';
    regiaoOpen;
    itens: any[];
    unsub$ = new Subject();

    constructor(
        private router: Router,
        private sidebarService: SidebarService,
        private supresinhaService: SupresinhaService,
        private el: ElementRef,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.sidebarService.itens
            .pipe(takeUntil(this.unsub$))
            .subscribe(dados => {
                this.contexto = dados.contexto;
                this.itens = dados.itens;

                if (dados.esporte) {
                    this.esporte = dados.esporte;
                }

                const menuSideLeftEl = this.el.nativeElement.querySelector('#menu-side-left');
                this.renderer.setStyle(menuSideLeftEl, 'height', `${this.height}px`);
                this.cd.detectChanges();

                // setTimeout(e => {
                //     const menuSideLeftEl = this.el.nativeElement.querySelector('#menu-side-left');
                //     this.renderer.setStyle(menuSideLeftEl, 'height', `${this.height}px`);
                //     this.cd.detectChanges();
                // }, 250);
            });
    }

    abrirRegiao(regiao) {
        if (regiao === this.regiaoOpen) { // fechando
            this.regiaoOpen = null;
        } else { // abrindo
            this.regiaoOpen = regiao;
        }
    }

    /* Geração dos números aleatórios para loteria */
    gerarSupresinha(length, context) {
        const numbers = [];

        for (let index = 0; index < length; index++) {
            const number = this.generateRandomNumber(numbers, context);
            numbers.push(number);
        }

        numbers.sort((a, b) => a - b);
        this.supresinhaService.atualizarSupresinha(numbers);
    }

    /* Gerar número randômico */
    generateRandomNumber(numbers: Number[], context) {
        let number;

        if (context === 'seninha') {
            number = random(1, 60);
        } else {
            number = random(1, 80);
        }

        const find = numbers.find(n => n === number);

        if (!find) {
            return number;
        } else {
            return this.generateRandomNumber(numbers, context);
        }
    }

    goTo(url, queryParams) {
        this.router.navigate([url], {queryParams});
    }
}
