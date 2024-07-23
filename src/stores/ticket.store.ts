import { defineStore } from "pinia"

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        bettor: '',
        value: 0,
        items: {} as any,
        accepted: false,

    }),
    actions: {
        setBettor(bettor: string) {
            this.bettor = bettor;
        },
        setValue(value: number) {
            this.value = value;
        },
        setAccepted(accepted: boolean) {
            this.accepted = accepted;
        },

        addQuote({
            gameId,
            gameName,
            eventId,
            live,
            quoteKey,
            quoteValue,
            quoteName,
            quoteGroupName
        }: any) {
            const items = { ...this.items };
            items[gameId] = {
                gameId,
                gameName,
                eventId,
                live,
                quoteKey,
                quoteValue,
                quoteName,
                quoteGroupName
            };
            this.items = { ...items }
        },
        removeQuote(gameId: number) {
            const items = { ...this.items };
            delete items[gameId];
            this.items = { ...items };
        },
        clear() {
            this.items = {};
            this.bettor = '';
            this.value = 0;
            this.accepted = false;
        }
    },
})