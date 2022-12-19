import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    constructor(
        private toastr: ToastrService,
        private translate: TranslateService
    ) {
    }

    success(msg: string, title?: string) {
        this.toastr.success(msg, title ? title : this.translate.instant('geral.sucesso'), {
            timeOut: 3000,
        });
    }

    error(msg: string, title?) {
        this.toastr.error(msg, title ? title : this.translate.instant('geral.atencao'), {
            timeOut: 3000,
        });
    }

    warning(msg: string) {
        this.toastr.warning(msg, this.translate.instant('geral.atencao'), {
            timeOut: 3000,
        });
    }
}
