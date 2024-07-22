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
            quoteValue
        }: any) {
            this.items[gameId] = {
                gameId,
                gameName,
                eventId,
                live,
                quoteKey,
                quoteValue
            };
        },

        removeQuote(gameId: number) {
            delete this.items[gameId];
        }
    },
})