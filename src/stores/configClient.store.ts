import { LocalStorageKey, localStorageService } from "@/services";
import { getAndroidVersion, now } from "@/utilities";
import { defineStore } from "pinia"

interface ConfigClient {
  name: string;
  slug: string;
  host: string;
}

interface PrinterSetting {
  printGraphics?: boolean;
  apkVersion?: number;
  printerWidth?: number;
}

const production = true;
const _host = production ? 'https://central.demo.wee.bet' : 'http://localhost';
const _loki = production ? 'https://loki1.weebet.tech' : 'http://localhost:8000';
const _center = production ? 'https://center7.wee.bet' : 'https://hermes.wee.bet';
const _live = 'https://streaming.wee.bet';
const _name = 'DEMO';
const _slug = 'weebet.jm';

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
  return Boolean(configClient) ? `${configClient.host}/api` : `${_host}/api`
}

const prepareChampionshipExpanded = () => {
  const settings = localStorageService.get(LocalStorageKey.SETTINGS);
  return Boolean(settings) ? settings?.championshipExpanded : true;
}

export const useConfigClient = defineStore('configClient', {
  state: () => ({
    name: prepareClientName(),
    slug: prepareClientSlug(),
    apiUrl: prepareClientHost(),
    lokiUrl: _loki,
    liveUrl: _live,
    centerUrl: `${_center}/v1`,
    params: {} as any,
    readyForUse: true,

    printerSetting: {
      printGraphics: false,
      apkVersion: 0,
      printerWidth: 58
    },
    settings: {
      championshipExpanded: prepareChampionshipExpanded(),
    }
  }),
  getters: {
    config: (state) => state,
    logo: (state) => `https://weebet.s3.amazonaws.com/${state.slug}/logos/logo_banca.png`,
    paramUrl: (state) => `https://weebet.s3.amazonaws.com/${state.slug}/param/parametros.json?${+ new Date()}`,
    clientCenterUrl: () => {
      const configClient = localStorageService.get(LocalStorageKey.CONFIG_CLIENT);
      return Boolean(configClient) ? configClient.host : _host
    },
    options: (state) => state.params?.opcoes ?? null,
    sportEnabled: (state) => state.params?.opcoes?.esporte ?? false,
    lotteryEnabled: (state) => state.params?.opcoes?.loterias ?? false,
    maxLotteryValue: (state) => state.params?.opcoes?.valor_max_premio_loterias,
    getSenaName: (state) => state.params?.opcoes?.seninha_nome ?? null,
    getQuinaName: (state) => state.params?.opcoes?.quininha_nome ?? null,
    betOptions: (state) => state.params?.tipos_aposta ?? null,
    myBetOptions: (state) => {
      const betOptions = localStorageService.get(LocalStorageKey.CONFIG_CLIENT);
      return Boolean(betOptions) ? betOptions : (state.params?.tipos_aposta ?? null)
    },
    mainOdds: (state) => state.params?.odds_principais ?? [],
    popularLeagues: (state) => state.params?.ligas_populares ?? [],
    blockedGames: (state) => state.params?.jogos_bloqueados ?? [],
    liveChampionships: (state) => state.params?.campeonatos_aovivo ?? [],
    blockedChampionships: (state) => state.params?.campeonatos_bloqueados ?? null,
    localQuotes: (state) => state.params?.cotacoes_local ?? [],
    deadlineTable: (state) => state.params?.data_limite_tabela ?? null,
    sportbook: (state) => state.params?.opcoes?.sportbook ?? 'betsapi',
    delayLiveBet: (state) => {
      const delay = Number(state.params?.opcoes?.delay_aposta_aovivo ?? 10);
      return delay < 10 ? 10 : delay;
    },
    hasParams: (state) => Boolean(Object.values(state.params).length),
    bettorDocumentNumberEnabled: (state) => Boolean(state.params?.opcoes?.allow_bettor_document_number_on_the_ticket),
    chartDeprecatedByAndroidVersion: () => {
      try {
        const androidVersion = String(getAndroidVersion()).split('.')[0];
        return Number(androidVersion) <= 9;
      } catch (error) {
        void error;
        return false; 
      }
    },
    popularLotteryDeprecatedByAndroidVersion: () => {
      try {
        const androidVersion = String(getAndroidVersion()).split('.')[0];
        return Number(androidVersion) <= 8;
      } catch (error) {
        void error;
        return false; 
      }
    },
    firstDayOfTheWeek: () => {
      const currentDate = now();
      const isSunday = currentDate.day() == 0;
      if(isSunday) {
        return currentDate
          .startOf('week')
          .subtract(1, 'week')
          .add(1, 'days');
      } else {
        return currentDate
          .startOf('week')
          .add(1, 'days');
      }
    }
  },
  actions: {
    setConfig({host, name, slug}: ConfigClient) {
      this.name = name;
      this.slug = slug;

      localStorageService.set(LocalStorageKey.CONFIG_CLIENT, {
        name: this.name,
        slug: this.slug,
        host
      })
    },
    setParams(params: any) {
      this.params = params;
    },
    setReadyForUse(ready: boolean) {
      this.readyForUse = ready;
    },
    setPrinterSetting(setting: PrinterSetting) {
      this.printerSetting = {
        ...this.printerSetting,
        ...setting
      }
    },
    setSettings(settings: any) {
      this.settings = {
        ...this.settings,
        ...settings
      }

      localStorageService.set(LocalStorageKey.SETTINGS, this.settings);
    },
    setBlockedChampionships(sportId: string, ids: string[]) {
      if (!this.params.campeonatos_bloqueados) {
        this.params.campeonatos_bloqueados = {};
      }
      this.params.campeonatos_bloqueados[`sport_${sportId}`] = ids;
    }
  },
})