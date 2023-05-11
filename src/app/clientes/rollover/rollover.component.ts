import { RegrasBonusModalComponent } from './../../shared/layout/modals/regras-bonus-modal/regras-bonus-modal.component';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/layout/base-form/base-form.component';
import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MessageService} from '../../shared/services/utils/message.service';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { SidebarService, FinanceiroService } from 'src/app/services';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Rollover} from '../../models';
import {ConfirmModalComponent} from 'src/app/shared/layout/modals';

@Component({
    selector: 'app-rollover',
    templateUrl: './rollover.component.html',
    styleUrls: ['./rollover.component.css']
})
export class RolloverComponent extends BaseFormComponent implements OnInit, OnDestroy {

    rollovers: Rollover[] = [];
    showLoading = true;
    smallScreen = false;
    page = 1;
    whatsapp;
    mobileScreen;
    queryParams;
    modalRef;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private financeiroService: FinanceiroService,
        private sidebarService: SidebarService,
        public activeModal: NgbActiveModal,
        private messageService: MessageService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) { super();}

    ngOnInit(): void {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.sidebarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }
        this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        this.smallScreen = window.innerWidth < 669;
        this.getRollovers();
        this.createForm();
        this.submit();

    }

    getRollovers(queryParams?: any) {
        this.showLoading = true;
        this.financeiroService.getRollovers(queryParams)
        .subscribe(
            response => {
                this.rollovers = response;
                this.showLoading = false;
            },
            error => {
                this.handleError(error);
                this.showLoading = false;
            }
        );

    }

    handleError(error: string) {
        this.messageService.error(error);
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
    }

    createForm() {
        this.form = this.fb.group({
            status: [''],
        });

        this.submit();
    }

    submit() {
        this.queryParams = this.form.value;
        const queryParams: any = {
            'status': this.queryParams.status,
        };
        this.getRollovers(queryParams);
    }

    converterBonus(rolloverId){
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Converter Bônus';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja converter seu bônus em saldo real?';

        this.modalRef.result.then(
            () => {
                this.financeiroService.converterBonus(rolloverId)
                    .subscribe(
                        response => {
                            this.messageService.success('Bônus Convertido');
                            this.submit();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    cancelarBonus(rolloverId){
        this.modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
        this.modalRef.componentInstance.title = 'Cancelar Bônus';
        this.modalRef.componentInstance.msg = 'Tem certeza que deseja cancelar seu bônus?';

        this.modalRef.result.then(
            () => {
                this.financeiroService.cancelarBonus(rolloverId)
                    .subscribe(
                        response => {
                            this.messageService.success('Bônus Cancelado');
                            this.submit();
                        },
                        error => {
                            this.handleError(error);
                        }
                    );
            }
        );
    }

    abrirRegrasBonus() {
        this.modalService.open(RegrasBonusModalComponent, {
            centered: true,
            size: 'xl',
        });
    }


}
