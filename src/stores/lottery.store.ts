import { lotteryTypeList } from "@/constants";
import { LotteryTypes } from "@/enums";
import { defineStore } from "pinia"

export const useLotteryStore = defineStore('lottery', {
    state: () => ({
        tensSelected: [] as number[],
        lotteryTypeSelected: LotteryTypes.QUININHA,
        loteryNumbersSelected: 5,
        options: {
            types: lotteryTypeList(),
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

        addTens(number: number) {
            this.tensSelected.push(number);
            console.log(this.tensSelected)
        },
        removeTens(number: Number) {
            this.tensSelected = this.tensSelected.filter(tensNumber => tensNumber != number);
        },
        removeAlltens() {
            this.tensSelected = [];
        }
    },
})