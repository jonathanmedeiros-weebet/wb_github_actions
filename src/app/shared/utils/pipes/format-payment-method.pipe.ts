import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatPaymentMethod'
})
export class FormatPaymentMethodPipe implements PipeTransform {

	transform(paymentMethod: string): string {
		switch (paymentMethod) {
			case 'pagfast':
                return "Pagfast";
            case 'primepag':
                return "PrimePag";
            case 'mercado_pago':
                return "Mercado Pago";
            case 'sautopay':
                return "SautoPay";
            case 'gerencianet':
                return "Gerencianet";
            case 'bigpag':
                return "BigPag";
            case 'letmepay':
                return "LetMePay";
            case 'paag':
                return "Paag";
            case 'pay2m':
                return 'Pay2m';
            case 'okto':
                return 'Okto';
            case 'pixs':
                return 'Pixs';
            case 'bigpagv3':
                return "BigPagV3";
            case 'lisboapay':
                return 'LisboaPAY';
		}

        return "";
	}

}
