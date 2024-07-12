import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroModalComponent, LoginModalComponent } from '../shared/layout/modals';
import { AuthService } from 'src/app/services';

declare function BTRenderer(): void;

@Component({
    selector: 'app-betby',
    templateUrl: 'betby.component.html',
    styleUrls: ['betby.component.css'],
})

export class BetbyComponent implements OnInit, OnDestroy {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
    ) {
        let node = document.createElement("script");
        node.src = "https://ui.invisiblesport.com/bt-renderer.min.js";
        document.body.prepend(node);
    }

    ngOnInit() {
        setTimeout(() => {
            this.betbyInitialize(this.authService.getTokenBetby());
        }, 1000);
    }

    ngOnDestroy() {
    }

    betbyInitialize(token = null) {
        let that = this;


        let bt = new BTRenderer().initialize({
            brand_id: '2415231049618558976',
            token: token ?? null,
            onTokenExpired: function() {},
            themeName: "get-x",
            lang: "pt-br",
            target: document.getElementById('betby'),
            betSlipOffsetTop: 0,
            betslipZIndex: 0,
            onRouteChange: function(path: string) { console.log(path) },
            onLogin: function() { that.openLogin() },
            onRegister: function() { that.openRegister() },
            onRecharge: function() { that.openDeposit() },
            onSessionRefresh: function() {},
            onBetSlipStateChange: function() {}
        });
    }

    openRegister() {
        this.modalService.open(
            CadastroModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                size: 'md',
                centered: true,
                windowClass: 'modal-500 modal-cadastro-cliente'
            }
        );
    }

    openLogin() {
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }

    openDeposit() {
        this.modalService.open(
            LoginModalComponent,
            {
                ariaLabelledBy: 'modal-basic-title',
                windowClass: 'modal-550 modal-h-350 modal-login',
                centered: true,
            }
        );
    }
}
