import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipPerRegionList: []
    }),
    actions: {
        setChampionshipPerRegionList(championships: any) {
            this.championshipPerRegionList = championships
        }
    },
})