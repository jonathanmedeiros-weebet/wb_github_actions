import { lotteryTypeList } from "@/constants";
import { LotteryTypes } from "@/enums";
import { defineStore } from "pinia"

export const useLotteryStore = defineStore('lottery', {
    state: () => ({
        tensSelected: [] as number[],
        lotteryTypeSelected: LotteryTypes.QUININHA,
        loteryNumbersSelected: 5,
        loteryOptionsSelected: null,
        lotteryValue: 0,
        options: {
            types: lotteryTypeList(),
            lotteries: []
        },
    }),
    getters: {
        sizes: ({lotteryTypeSelected}) => {
            return lotteryTypeSelected == LotteryTypes.QUININHA ? 70 : 50;
        },
        minSize: ({lotteryTypeSelected}) => {
            return lotteryTypeSelected == LotteryTypes.QUININHA ? 5 : 6;
        },
    },
    actions: {
        setLotteryTypeSelected(typeSelected: LotteryTypes) {
            this.lotteryTypeSelected = typeSelected;
            this.loteryNumbersSelected = this.minSize;
        },
        setLotteryNumbersSelected(numbersSelected: any) {
            this.loteryNumbersSelected = numbersSelected;
        },
        setLotteryOptionsSelected(lotteryOption: any) {
            this.loteryOptionsSelected = lotteryOption;
        },
        setLotteryValue(value: any) {
            this.lotteryValue = value;
        },

        setLotteryOptions(options: any) {
            this.options.lotteries = options;
        },

        addTens(number: number) {
            this.tensSelected.push(number);
        },
        removeTens(number: Number) {
            this.tensSelected = this.tensSelected.filter(tensNumber => tensNumber != number);
        },
        removeAlltens() {
            this.tensSelected = [];
        }
    },
})