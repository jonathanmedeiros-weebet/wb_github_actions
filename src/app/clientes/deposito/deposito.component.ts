import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService, FinanceiroService, MessageService, LayoutService } from 'src/app/services';
import {ParametrosLocaisService} from '../../shared/services/parametros-locais.service';
import {MenuFooterService} from '../../shared/services/utils/menu-footer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BannersComponent } from 'src/app/shared/layout/banners/banners.component';

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit, OnDestroy, AfterViewInit {
    unsub$ = new Subject();

    whatsapp;
    hasApiPagamentos;
    modalidade;
    showLoading = false;
    showLoadingIndicator:boolean = true;
    mobileScreen;

    headerHeight = 92;

    @ViewChild(BannersComponent) bannersComponent!: BannersComponent;

    constructor(
        private paramsLocais: ParametrosLocaisService,
        private menuFooterService: MenuFooterService,
        private siderbarService: SidebarService,
        private messageService: MessageService,
        public activeModal: NgbActiveModal,
        private cd: ChangeDetectorRef,
        private el: ElementRef,
        private layoutService: LayoutService,
        private renderer: Renderer2
    ) {
    }
    ngAfterViewInit(): void {
        this.showLoadingIndicator = this.bannersComponent.showLoadingIndicator;
    }

    ngOnInit() {
        this.mobileScreen = window.innerWidth <= 1024;
        if (!this.mobileScreen) {
            this.siderbarService.changeItens({contexto: 'cliente'});
            this.menuFooterService.setIsPagina(true);
        }

        if (this.paramsLocais.getOpcoes().whatsapp) {
            this.whatsapp = this.paramsLocais.getOpcoes().whatsapp.replace(/\D/g, '');
        }
        this.hasApiPagamentos = Boolean(this.paramsLocais.getOpcoes().available_payment_methods.length);

        if (!this.hasApiPagamentos && this.whatsapp) {
            this.modalidade = 'whatsapp';
        } else {
            this.modalidade = 'pix';
        }

        if (!this.mobileScreen) {
            this.layoutService.currentHeaderHeight
                .pipe(takeUntil(this.unsub$))
                .subscribe(curHeaderHeight => {
                    this.headerHeight = curHeaderHeight;
                    this.changeHeight();
                    this.cd.detectChanges();
                });
        }
    }
    
    changeHeight() {
        const headerHeight = this.headerHeight;
        const height = window.innerHeight - headerHeight;
        const defaultContent = this.el.nativeElement.querySelector('#default-content');
        this.renderer.setStyle(defaultContent, 'height', `${height}px`);
    }

    selecionarModalidade(modalide) {
        this.modalidade = modalide;
    }

    ngOnDestroy() {
        this.menuFooterService.setIsPagina(false);
        this.unsub$.next();
        this.unsub$.complete();
    }

    handleError(error: string) {
        this.messageService.error(error);
        this.showLoading = false;
    }
}
