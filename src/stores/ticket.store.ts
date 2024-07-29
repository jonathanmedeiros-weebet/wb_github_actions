import { defineStore } from "pinia"
import { useConfigClient } from "./configClient.store";
import { useToastStore } from "./toast.store";
import { ToastType } from "@/enums";

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        bettor: '',
        value: 0,
        items: {} as any,
        accepted: false,
        error: ''
    }),
    actions: {
        setError(error: string) {
            this.error = error
        },
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
            gameDate,
            eventId,
            live,
            quoteKey,
            quoteValue,
            quoteName,
            quoteGroupName,
            favorite,
            modalityId
        }: any) {
            const items = { ...this.items };

            if(!Boolean(items[gameId])) {
                const { options } = useConfigClient();
                const { quantidade_max_jogos_bilhete } = options;
                const qtdItems = Object.values(items).length;

                if(qtdItems >= quantidade_max_jogos_bilhete) {
                    const { setToastConfig } = useToastStore();
                    setToastConfig({
                        message: 'Desculpe, você atingiu a quantidade MÁXIMA de apostas.',
                        type: ToastType.DANGER,
                        duration: 3000
                    });
                    return;
                }
            }

            items[gameId] = {
                gameId,
                gameName,
                gameDate,
                eventId,
                live,
                quoteKey,
                quoteValue,
                quoteName,
                quoteGroupName,
                favorite,
                modalityId
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