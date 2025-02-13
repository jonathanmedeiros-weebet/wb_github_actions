import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinanceiroService } from 'src/app/shared/services/financeiro.service';
import { StepService } from 'src/app/shared/services/step.service';

@Component({
    selector: 'app-register-modal-component',
    templateUrl: './register-modal-component.component.html',
    styleUrls: ['./register-modal-component.component.scss']
})
export class RegisterModalComponentComponent {

    currentIndex = 0;
    totalSteps = 2;
    formInvalid = true;
    data = {};
    registerCancel = false;
    modalClose = true;
    promocoes: any;
    promocaoAtiva = false;
    valorPromocao: number | null = null;
    bonusModalidade: string | null = null;
    errorMessage = '';

    constructor(private stepService: StepService,
        public activeModal: NgbActiveModal,
        private financeiroService: FinanceiroService
    ) {
        this.stepService.currentIndex$.subscribe((index) => {
            this.currentIndex = index;
        });
        this.stepService.formValid$.subscribe((valid) => {
            this.formInvalid = !valid;
        })

    }

    previous() {
        this.stepService.previous();
    }

    next() {
        this.stepService.next();
    }

    dataChange(event: { [key: string]: any }) {
        this.data = { ...this.data, ...event }
    }

    onClose() {
        this.registerCancel = true;
        this.modalClose = false;
    }
    getPromocoes(queryParams?: any) {
        this.financeiroService.getPromocoes(queryParams)
            .subscribe(
                response => {
                    this.promocoes = response;
                    this.verificarPromocaoAtiva();
                },
                error => {
                    this.handleError(error);
                }
            );
    }

    verificarPromocaoAtiva(): void {
        if (this.promocoes && this.promocoes.length > 0) {
            const promocaoCassino = this.promocoes.find(promocao =>
                promocao.ativo &&
                promocao.tipo === 'primeiro_deposito_bonus' &&
                promocao.valorBonus > 0.00 &&
                promocao.bonusModalidade === 'cassino'
            );

            const promocaoEsportivo = this.promocoes.find(promocao =>
                promocao.ativo &&
                promocao.tipo === 'primeiro_deposito_bonus' &&
                promocao.valorBonus > 0.00 &&
                promocao.bonusModalidade === 'esportivo'
            );

            if (promocaoCassino) {
                this.promocaoAtiva = promocaoCassino.ativo;
                this.valorPromocao = parseFloat(promocaoCassino.valorBonus);
            } else if (promocaoEsportivo) {
                this.promocaoAtiva = promocaoEsportivo.ativo;
                this.valorPromocao = parseFloat(promocaoEsportivo.valorBonus);
            }
        }
    }
    handleError(error: string) {
        this.errorMessage = error;
    }

    cancelModal() {
        this.stepService.reset();
        this.activeModal.dismiss();
    }

    registerOpen() {
        this.registerCancel = false;
        this.modalClose = true;
    }

}
