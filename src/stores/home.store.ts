import { modalityList } from "@/constants";
import type { ChampionshipPerRegion } from "@/interfaces";
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipList: [],
        championshipPerRegionList: [] as ChampionshipPerRegion[],
        championshipSelected: null,
        isLive: false,
        modality: null
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
        },
        setModality(modality: any) {
            this.modality = modality;
        }
    },
})