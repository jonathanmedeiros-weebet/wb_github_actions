import type { ChampionshipPerRegion } from "@/interfaces";
import { now } from "@/utilities";
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => ({
        championshipList: [],
        championshipPerRegionList: [] as ChampionshipPerRegion[],
        regionSelected: null,
        championshipSelected: null,
        dateSelected: now().format('YYYY-MM-DD'),
    }),
    actions: {
        setChampionshipPerRegionList(championships: any) {
            this.championshipPerRegionList = championships.map((region: any) => {
                const championships = region.campeonatos.map(({_id, nome}: any) => ({
                  id: _id,
                  name: nome.replace(`${region._id}: `, '').toUpperCase()
                }));
        
                championships.unshift({
                  id: `region_${region._id}`,
                  name: `TODOS OS CAMPEONATOS`.toUpperCase()
                })
        
                return {
                    id: `region_${region._id}`,
                    name: region._id.toUpperCase(),
                    slug: region.sigla,
                    championships
                } as ChampionshipPerRegion;
            });

            if(Boolean(this.championshipPerRegionList.length)) {
                this.championshipPerRegionList.unshift({
                    id: "region_ALL",
                    name: "Todos os campeonatos".toUpperCase(),
                    slug: "all",
                    championships: []
                });
            }
        },
        setChampionshipList(championships: any) {
            this.championshipList = championships;
        }
    },
})