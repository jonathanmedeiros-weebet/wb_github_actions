import { LocalStorageKey, localStorageService } from "@/services";
import { defineStore } from "pinia"

interface ConfigClient {
  name: string;
  slug: string;
  apiUrl: string;
}

const _host = '//localhost';
const _loki = '//localhost:8000';
const _center = 'https://hermes.wee.bet';
const _name = 'DEMO';
const _slug = 'demo.wee.bet';

const prepareClientName = () => {
  const configClient = localStorageService.get(LocalStorageKey.CONFIG_CLIENT);
  return Boolean(configClient) ? configClient.name : _name
}

const prepareClientSlug = () => {
  const configClient = localStorageService.get(LocalStorageKey.CONFIG_CLIENT);
  return Boolean(configClient) ? configClient.slug : _slug
}

const prepareClientHost = () => {
  const configClient = localStorageService.get(LocalStorageKey.CONFIG_CLIENT);
  return Boolean(configClient) ? configClient.host : `${_host}/api`
}

export const useConfigClient = defineStore('configClient', {
  state: () => ({
    name: prepareClientName(),
    slug: prepareClientSlug(),
    apiUrl: prepareClientHost(),
    lokiUrl: _loki,
    centerUrl: `${_center}/v1`,
    sportsUrl: `${_host}/api/esportes`,
    params: {} as any,

    readyForUse: false
  }),
  getters: {
    config: (state) => state,
    logo: (state) => `https://weebet.s3.amazonaws.com/${state.slug}/logos/logo_banca.png`,
    paramUrl: (state) => `https://weebet.s3.amazonaws.com/${state.slug}/param/parametros.json?${+ new Date()}`,

    options: (state) => state.params?.opcoes ?? null,
    betOptions: (state) => state.params?.tipos_aposta ?? null,
    mainOdds: (state) => state.params?.odds_principais ?? [],
    popularLeagues: (state) => state.params?.ligas_populares ?? [],
    blockedGames: (state) => state.params?.jogos_bloqueados ?? [],
    liveChampionships: (state) => state.params?.campeonatos_aovivo ?? [],
    blockedChampionships: (state) => state.params?.campeonatos_bloqueados ?? null,
    localQuotes: (state) => state.params?.cotacoes_local ?? [],
    deadlineTable: (state) => state.params?.data_limite_tabela ?? null,
  },
  actions: {
    setConfig(config: ConfigClient) {
      this.name = config.name;
      this.slug = config.slug;
      this.apiUrl = `//${config.apiUrl}/api`;

      localStorageService.set(LocalStorageKey.CONFIG_CLIENT,{
        name: this.name,
        slug: this.slug,
        apiUrl: this.apiUrl,
      })
    },
    setParams(params: any) {
      this.params = params;
    },
    setReadyForUse(ready: boolean) {
      this.readyForUse = ready;
    }
  },
})