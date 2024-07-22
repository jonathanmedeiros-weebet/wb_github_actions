interface ChampionshipItemPerRegion {
    id: string;
    name: string;
}

export interface ChampionshipPerRegion {
    id: string;
    name: string;
    slug: string;
    championships: ChampionshipItemPerRegion[];
}