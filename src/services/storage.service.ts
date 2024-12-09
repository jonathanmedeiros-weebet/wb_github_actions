export enum LocalStorageKey {
    CONFIG_CLIENT = 'config_client',
    TOKEN = 'cToken',
    USER = 'user'
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
        localStorage.removeItem(LocalStorageKey.TOKEN);
        localStorage.removeItem(LocalStorageKey.USER);
    }
}