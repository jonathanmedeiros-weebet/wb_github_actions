import {Component, OnInit} from '@angular/core';
declare var MercadoPago: any;
@Component({
    selector: 'app-solicitacao-recarga',
    templateUrl: './solicitacao-recarga.component.html',
    styleUrls: ['./solicitacao-recarga.component.css']
})
export class SolicitacaoRecargaComponent implements OnInit {
    mp;

    constructor() {
    }

    ngOnInit() {
        this.mp = new MercadoPago('TEST-b563cc16-5e9f-483f-8141-ac9f9d6370f1');
        this.mp.createCardToken({
            cardNumber: '5031433215406351' ,
            cardholderName: 'APRO',
            cardExpirationMonth: '11',
            cardExpirationYear: '2025',
            securityCode: '123',
            identificationType: 'CPF',
            identificationNumber: '12345678912',
        }).then(
            (res: any) => {
                console.log(res);
            }
        );
    }

}
