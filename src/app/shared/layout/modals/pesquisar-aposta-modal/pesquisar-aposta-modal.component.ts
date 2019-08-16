import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExibirBilheteEsportivoComponent } from './../../exibir-bilhete/esportes/exibir-bilhete-esportivo.component';
import { ExibirBilheteLoteriaComponent } from './../../exibir-bilhete/loteria/exibir-bilhete-loteria.component';
import { AuthService, ApostaService, MessageService, ParametrosLocaisService } from './../../../../services';

@Component({
    selector: 'app-pesquisar-aposta-modal',
    templateUrl: './pesquisar-aposta-modal.component.html',
    styleUrls: ['./pesquisar-aposta-modal.component.css']
})
export class PesquisarApostaModalComponent implements OnInit, OnDestroy {
    @ViewChild(ExibirBilheteEsportivoComponent, { static: false }) bilheteEsportivoComponent: ExibirBilheteEsportivoComponent;
    @ViewChild(ExibirBilheteLoteriaComponent, { static: false }) bilheteLoteriaComponent: ExibirBilheteLoteriaComponent;
    exibirBilhete = false;
    aposta;
    appMobile;
    pesquisarForm: FormGroup = this.fb.group({
        input: ['']
    });
    unsub$ = new Subject();

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private apostaService: ApostaService,
        private messageService: MessageService,
        private auth: AuthService,
        private paramsLocais: ParametrosLocaisService
    ) { }

    ngOnInit() {
        this.appMobile = this.auth.isAppMobile();
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    pesquisarAposta() {
        const input = this.pesquisarForm.value.input;

        this.apostaService.getAposta(input)
            .pipe(takeUntil(this.unsub$))
            .subscribe(
                aposta => {
                    this.pesquisarForm.reset();
                    this.aposta = aposta;
                    this.exibirBilhete = true;
                },
                error => this.messageService.error(error)
            );
    }

    printTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.print();
        } else {
            this.bilheteLoteriaComponent.print();
        }
    }

    shareTicket() {
        if (this.aposta.tipo === 'esportes') {
            this.bilheteEsportivoComponent.shared();
        } else {
            this.bilheteLoteriaComponent.shared();
        }
    }

    compartilhamentoPermitido() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (this.appMobile && opcoes.habilitar_compartilhamento_comprovante) {
            result = true;
        }

        return result;
    }


    impressaoPermitida() {
        const opcoes = this.paramsLocais.getOpcoes();
        let result = false;

        if (opcoes.permitir_reimprimir_aposta) {
            result = true;
        }

        return result;
    }
}
