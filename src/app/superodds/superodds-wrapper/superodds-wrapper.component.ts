import { Component, OnInit, OnDestroy, ElementRef, Renderer2, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidebarService, DesafioCategoriaService, MessageService, LayoutService } from '../../services';

@Component({
    selector: 'app-superodds-wrapper',
    templateUrl: './superodds-wrapper.component.html',
    styleUrls: ['./superodds-wrapper.component.css']
})
export class SuperoddsWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
    unsub$ = new Subject();
    headerHeight = 92;

    constructor(
        private sidebarService: SidebarService,
        private el: ElementRef,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
        private layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.layoutService.currentHeaderHeight
            .pipe(takeUntil(this.unsub$))
            .subscribe(curHeaderHeight => {
                this.headerHeight = curHeaderHeight;
                this.definirAltura();
                this.cd.detectChanges();
            });
    }

    ngAfterViewInit() {
        this.sidebarService.changeItens({});
    }

    ngOnDestroy() {
        this.unsub$.next();
        this.unsub$.complete();
    }

    definirAltura() {
        const desafiosWrapper = this.el.nativeElement.querySelector('#superodds-wrapper');
        const desafiosContent = this.el.nativeElement.querySelector('.superodds-content');
        this.renderer.setStyle(desafiosWrapper, 'max-height', `calc(100vh - ${this.headerHeight}px)`);
        this.renderer.setStyle(desafiosContent, 'height', `calc(100vh - ${this.headerHeight}px)`);
    }

}
