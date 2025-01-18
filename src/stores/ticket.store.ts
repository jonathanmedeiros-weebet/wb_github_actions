import { defineStore } from "pinia"
import { useConfigClient } from "./configClient.store";
import { useToastStore } from "./toast.store";
import { LotteryTypes, ToastType } from "@/enums";
import { getModalitiesEnum } from "@/constants";
import { calculateLotteryWinnings } from "@/utilities";

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        modalityId: null,
        bettor: '',
        bettorDocumentNumber: '',
        value: 0,
        award: 0,
        items: {} as any,
        championshipOpened: [] as any[],
        accepted: false,
        error: ''
    }),
    actions: {
        setModalityId(modalityId: any) {
            this.modalityId = modalityId;

            this.value = 0;
            this.items = {};
            this.accepted = false;
            this.error = '';
            this.bettor = '';
            this.bettorDocumentNumber = '';
        },
        setError(error: string) {
            this.error = error
        },
        setBettor(bettor: string) {
            this.bettor = bettor;
        },
        setBettorDocumentNumber(bettorDocumentNumber: string) {
            this.bettorDocumentNumber = bettorDocumentNumber;
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
            finalQuoteValue,
            quoteName,
            quoteGroupName,
            favorite,
            modalityId,
            championshipId,
            previousQuoteValue = null
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
                        type: ToastType.WARNING,
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
                finalQuoteValue,
                previousQuoteValue,
                quoteName,
                quoteGroupName,
                favorite,
                modalityId,
                championshipId,
                timestamp: Date.now()
            };

            this.items = { ...items };

            this.prepareChampionshipOpenedIds();
        },
        removeQuote(gameId: number) {
            const items = { ...this.items };
            delete items[gameId];
            
            this.items = { ...items };

            this.prepareChampionshipOpenedIds();
        },

        clear() {
            this.items = {};
            this.value = 0;
            this.award = 0;
            this.accepted = false;

            const Modalities = getModalitiesEnum();
            const isModalityLottery = this.modalityId == Modalities.LOTTERY

            if(!isModalityLottery) {
                this.prepareChampionshipOpenedIds();
            }
        },
        prepareChampionshipOpenedIds() {
            this.championshipOpened = Object.values(this.items).map((item: any) => item.championshipId);
        },

        addTen({
            ten,
            type,
            lotteryId,
            lotteryTitle,
            value,
            quote06,
            quote05,
            quote04,
            quote03
        }: any) {
            const items = { ...this.items };

            const award06 = Boolean(quote06) ? calculateLotteryWinnings(value, quote06) : 0;
            const award05 = calculateLotteryWinnings(value, quote05);
            const award04 = calculateLotteryWinnings(value, quote04);
            const award03 = calculateLotteryWinnings(value, quote03);
 
            const timeStamp = Math.floor(Date.now() / 1000);
            items[timeStamp] = {
                id: timeStamp,
                tens: ten,
                type,
                lotteryId,
                lotteryTitle,
                value,
                award06,
                award05,
                award04,
                award03
            }

            this.items = { ...items };
            this.value += value;

            this.award += type == LotteryTypes.QUININHA
                ? award05
                : award06;
        },
        removeTen(tenId: number) {
            const items = { ...this.items };
            this.value -= items[tenId].value;
            
            this.award -= items[tenId].type == LotteryTypes.QUININHA
                ? items[tenId].award05
                : items[tenId].award06;
            
            delete items[tenId];
            this.items = { ...items };
        }
    },
})
