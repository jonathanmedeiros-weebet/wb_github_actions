import { Inject, Injectable, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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
    tawakChatClicked: boolean = false;

    private hideSubmenuSub = new BehaviorSubject<boolean>(false);
    private hideSubmenuCtrl = false;
    hideSubmenu;

    constructor(
        @Inject(DOCUMENT) private document: any
    ) {
        this.currentIndiqueGanheCardHeight = this.indiqueGanheCardHeightSub.asObservable();
        this.currentSubmenuHeight = this.submenuHeightSub.asObservable();
        this.currentHeaderHeight = this.currentHeaderHeightSub.asObservable();
        this.verificaRemocaoIndiqueGanhe = this.statusIndiqueGanheAtivo.asObservable();
        this.hideSubmenu = this.hideSubmenuSub.asObservable();
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

    changeHeaderHeigh(height: number): void {
        this.defaultHeaderHeight = height;
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

    onPageScroll(element) {
        const firstScrollTop = element.scrollTop;
        setTimeout(() => {
            if (element.scrollTop > firstScrollTop && !this.hideSubmenuCtrl) {
                this.hideSubmenuSub.next(true);
                this.hideSubmenuCtrl = true;
            } else if (element.scrollTop < firstScrollTop && this.hideSubmenuCtrl) {
                this.hideSubmenuSub.next(false);
                this.hideSubmenuCtrl = false;
            } else if (element.scrollTop == 0 && this.hideSubmenuCtrl) {
                this.hideSubmenuSub.next(false);
                this.hideSubmenuCtrl = false;
            }
        }, 50);
    }

    resetHideSubmenu() {
        this.hideSubmenuCtrl = false;
        this.hideSubmenuSub.next(false);
    }

    hideLiveChats(renderer: Renderer2) {
        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];

        if (botaoContatoFlutuante) {
            renderer.setStyle(botaoContatoFlutuante, 'z-index', '-1');
        }

        const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
        if (jivoChatBtn) {
            renderer.setStyle(jivoChatBtn, 'display', 'none');
        }

        const liveChatBtn = this.document.getElementById('chat-widget-container');
        if (liveChatBtn) {
            renderer.setStyle(liveChatBtn, 'display', 'none');
        }

        const TawkChat = this.document.querySelector('.widget-visible') as HTMLElement;
        if (TawkChat) {
            const tawakIframes = this.document.querySelectorAll('[title="chat widget"]')
            this.tawakChatClicked = tawakIframes[1].style.display == 'block'

            tawakIframes.forEach(iframeChat => renderer.setStyle(iframeChat, 'display', 'none'));
        }

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            renderer.setStyle(zendeskChat, 'display', 'none');
        }

        const intercomBtnChat = this.document.querySelector('.intercom-launcher');
        if (intercomBtnChat) {
            renderer.setStyle(intercomBtnChat, 'display', 'none');
        }

        const intercomContainer = this.document.querySelector('#intercom-container');
        if (intercomContainer) {
            renderer.setStyle(intercomContainer, 'display', 'none');
        }

        const hooryChat = this.document.querySelector('.woot--bubble-holder');
        if (hooryChat) {
            renderer.setStyle(hooryChat, 'display', 'none');
        }
    }

    restoreLiveChats(renderer: Renderer2) {
        let scriptGalaxsys = document.getElementById("galaxsysScript");

        if (scriptGalaxsys) {
            scriptGalaxsys.remove();

            const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
            if (botaoContatoFlutuante) {
                renderer.setStyle(botaoContatoFlutuante, 'z-index', '1000');
            }

            const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
            if (jivoChatBtn) {
                renderer.setStyle(jivoChatBtn, 'display', 'inline');
            }

            const liveChatBtn = this.document.getElementById('chat-widget-container');
            if (liveChatBtn) {
                renderer.setStyle(liveChatBtn, 'display', 'block');
            }

            const zendeskChat = this.document.querySelector('iframe#launcher');
            if (zendeskChat) {
                renderer.setStyle(zendeskChat, 'display', 'block');
            }
        }

        const botaoContatoFlutuante = this.document.getElementsByClassName('botao-contato-flutuante')[0];
        if (botaoContatoFlutuante) {
            renderer.setStyle(botaoContatoFlutuante, 'z-index', '1000');
        }

        const jivoChatBtn = this.document.getElementsByTagName('jdiv')[0];
        if (jivoChatBtn) {
            renderer.setStyle(jivoChatBtn, 'display', 'inline');
        }

        const liveChatBtn = this.document.getElementById('chat-widget-container');
        if (liveChatBtn) {
            renderer.setStyle(liveChatBtn, 'display', 'block');
        }

        const zendeskChat = this.document.querySelector('iframe#launcher');
        if (zendeskChat) {
            renderer.setStyle(zendeskChat, 'display', 'block');
        }

        const TawkChat = this.document.querySelector('.widget-visible') as HTMLElement;
        if (TawkChat) {
            this.document.querySelectorAll('[title="chat widget"]').forEach((iframeChat, key) => {
                if (key != 1 || this.tawakChatClicked) {
                    renderer.setStyle(iframeChat, 'display', 'block');
                }
            });
        }

        const intercomBtnChat = this.document.querySelector('.intercom-launcher');
        if (intercomBtnChat) {
            renderer.setStyle(intercomBtnChat, 'display', 'block');
        }

        const intercomContainer = this.document.querySelector('#intercom-container');
        if (intercomContainer) {
            renderer.setStyle(intercomContainer, 'display', 'block');
        }

        const hooryChat = this.document.querySelector('.woot--bubble-holder');
        if (hooryChat) {
            renderer.setStyle(hooryChat, 'display', 'block');
        }
    }
}
