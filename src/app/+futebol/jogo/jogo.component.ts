import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Jogo } from './../../models';
import { JogoService, MessageService } from './../../services';

import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
    selector: 'app-futebol-jogo',
    templateUrl: 'jogo.component.html'
})

export class JogoComponent implements OnInit {
    jogo: Jogo;
    sub: Subscription;

    constructor(
        private jogoService: JogoService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: any) => {
            if (params['id']) {
                const id = +params['id'];

                this.jogoService.getJogo(id).subscribe(
                    jogo => {
                        this.jogo = jogo;
                    },
                    error => this.messageService.error(error)
                );
            }
        });
    }
}
