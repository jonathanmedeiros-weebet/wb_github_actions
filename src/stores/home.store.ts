import type { ChampionshipPerRegion } from "@/interfaces";
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipList: [],
        championshipPerRegionList: [] as ChampionshipPerRegion[],
        championshipSelected: null,
        isLive: false
    }),
    actions: {
        setChampionshipPerRegionList(championships: any) {
            this.championshipPerRegionList = championships;
        },
        setChampionshipList(championships: any) {
            this.championshipList = championships;
        },
        setIsLive(isLive: boolean) {
            this.isLive = isLive;
        }
    },
})