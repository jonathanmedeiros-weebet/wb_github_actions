import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class MessageService {
    constructor() { }

    success(msg: string, title?: string) {
        // console.log(msg);
        // alert(msg);
        $.toast({
            heading: title ? title : 'Sucesso',
            text: msg,
            position: 'top-right',
            icon: 'success',
            hideAfter: 7000,
            stack: 6
        });
    }

    error(msg: string, title?) {
        // console.log(msg);
        // alert(msg);

        $.toast({
            heading: title ? title : 'Atenção',
            text: msg,
            position: 'top-right',
            loaderBg: '#ff6849',
            icon: 'error',
            hideAfter: 7000
        });
    }

    warning(msg: string) {
        $.toast({
            heading: 'Atenção',
            text: msg,
            position: 'top-right',
            showHideTransition: 'plain',
            icon: 'warning',
            hideAfter: 7000
        });
    }
}
