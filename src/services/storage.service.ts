import { useTicketStore } from "@/stores";

export enum LocalStorageKey {
    CONFIG_CLIENT = 'config_client',
    TOKEN = 'cToken',
    USER = 'user',
    BET_TYPES = 'bet_types',
    SETTINGS = 'settings',
    TICKET_ITEMS = 'ticket_items',
    TICKET_MODALITY_ID = 'ticket_modality_id'
}

export const localStorageService = {
    get: (name: string): any => {
        const value = localStorage.getItem(name);
        return value ? JSON.parse(value) : null;
    },
    set: (name: string, value: any): void => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    remove: (name: string): void => {
        localStorage.removeItem(name)
    },
    removeAll: () => localStorage.clear()
    ,
    removeAuth: () => {
        const { clear: clearTicket } = useTicketStore();
        clearTicket();

        localStorage.removeItem(LocalStorageKey.TOKEN);
        localStorage.removeItem(LocalStorageKey.USER);
        localStorage.removeItem(LocalStorageKey.BET_TYPES);
        localStorage.removeItem(LocalStorageKey.TICKET_ITEMS);
        localStorage.removeItem(LocalStorageKey.TICKET_MODALITY_ID);
    }
}