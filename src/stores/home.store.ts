import type { ChampionshipPerRegion } from "@/interfaces";
import { now } from "@/utilities";
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipList: [],
        championshipPerRegionList: [] as ChampionshipPerRegion[],
        championshipSelected: null,
        isLive: false,
        modality: null,
        league: null,
        date: now(),
        selectedSearch: false,
        inSearch: false,
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
        },
        setLeague(league: any) {
            this.league = league;
        },
        setDate(date: any) {
            this.date = date;
        },
        setSelectedSearch(selectedSearch: any) {
            this.selectedSearch = selectedSearch;
        },
        setInSearch(inSearch: any) {
            this.inSearch = inSearch;
        },
    },
})