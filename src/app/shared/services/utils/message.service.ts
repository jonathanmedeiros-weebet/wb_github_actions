import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    constructor(private toastr: ToastrService) { }

    success(msg: string, title?: string) {
        this.toastr.success(msg, title ? title : 'Sucesso');
    }

    error(msg: string, title?) {
        this.toastr.error(msg, title ? title : 'Atenção');
    }

    warning(msg: string) {
        this.toastr.warning(msg, 'Atenção');
    }
}
