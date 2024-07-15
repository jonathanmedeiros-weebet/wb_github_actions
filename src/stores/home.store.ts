import type { ChampionshipPerRegion } from "@/interfaces";
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipList: [],
        championshipPerRegionList: [] as ChampionshipPerRegion[],
        championshipSelected: null,
    }),
    actions: {
        setChampionshipPerRegionList(championships: any) {
            this.championshipPerRegionList = championships;
        },
        setChampionshipList(championships: any) {
            this.championshipList = championships;
        },
    },
})