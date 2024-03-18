import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class LayoutService {
	private indiqueGanheCardHeight = 0;
	private submenuHeight = 0;
	private defaultHeaderHeight = 92;
	private indiqueGanheCardHeightSub = new BehaviorSubject<number>(this.indiqueGanheCardHeight);
	private submenuHeightSub = new BehaviorSubject<number>(this.submenuHeight);
	private currentHeaderHeightSub = new BehaviorSubject<number>(this.defaultHeaderHeight);
	private statusIndiqueGanheAtivo = new BehaviorSubject<boolean>(false);

	currentIndiqueGanheCardHeight;
	currentSubmenuHeight;
	currentHeaderHeight;
	verificaRemocaoIndiqueGanhe;

	constructor() {
		this.currentIndiqueGanheCardHeight = this.indiqueGanheCardHeightSub.asObservable();
		this.currentSubmenuHeight = this.submenuHeightSub.asObservable();
		this.currentHeaderHeight = this.currentHeaderHeightSub.asObservable();
		this.verificaRemocaoIndiqueGanhe = this.statusIndiqueGanheAtivo.asObservable();
	}

	changeIndiqueGanheCardHeight(height: number): void {
		this.indiqueGanheCardHeight = height;
		this.indiqueGanheCardHeightSub.next(this.indiqueGanheCardHeight);

		this.recalculateHeaderHeight();
	}

	changeSubmenuHeight(height: number): void {
		this.submenuHeight = height;
		this.submenuHeightSub.next(this.submenuHeight);

		this.recalculateHeaderHeight();
	}

	private recalculateHeaderHeight(): void {
		this.currentIndiqueGanheCardHeight
			.subscribe(curIndiqueGanheCardHeight => {
				this.indiqueGanheCardHeight = curIndiqueGanheCardHeight;
			});

		this.currentSubmenuHeight
			.subscribe(curSubmenuHeight => {
				this.submenuHeight = curSubmenuHeight;
			});

		this.currentHeaderHeightSub.next(this.defaultHeaderHeight + this.indiqueGanheCardHeight + this.submenuHeight);
	}

	indiqueGanheRemovido(status: boolean): void {
		this.statusIndiqueGanheAtivo.next(status);
	}
}