import { Injectable } from "@angular/core";
export enum EventGa4Types {
    EARN_VIRTUAL_CURRENCY = 'earn_virtual_currency',
    LOGIN = 'login',
    PURCHASE = 'purchase',
    SEARCH  = 'search',
    SELECT_CONTENT = 'select_content',
    SHARE = 'share',
    SIGN_UP = 'sign_up',
    ADD_SHIPPING_INFO = 'add_shipping_info',
    ADD_TO_CART = 'add_to_cart',
    REMOVE_FROM_CART = 'remove_from_cart',
    VIEW_CART = 'view_cart',
    VIEW_ITEM = 'view_item',
    GENERATE_PIX = 'generate_pix',
    GENERATE_SAQUE = 'generate_saque',
    PURCHASE_BET_PLAYER_BONUS = 'purchase_bet_player_bonus',
    PURCHASE_BET_ANONYMOUS_NO_SMS = 'purchase_bet_anonymous_no_sms',
    PURCHASE_BET_PLAYER_PLACEBET = 'purchase_bet_player_placebet',
    START_REGISTRATION = 'start_registration',
    PRE_SIGN_UP = 'pre_sign_up'
}
@Injectable({
    providedIn: 'root'
})

export class Ga4Service {

    triggerGa4Event(type: EventGa4Types, data: any = null){
        const dataLayer = (window as any).dataLayer || [];

        if (dataLayer) {
            dataLayer.push({
            event: type,
            ...data
          });
        }
    }
}
