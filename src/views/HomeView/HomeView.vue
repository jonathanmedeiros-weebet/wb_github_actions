<template>
  <div class="home">
    <Header
      :showCalendarButton="true"
      :showSearchButton="true"
      @calendarClick="handleOpenCalendarModal"
      @searchClick="handleOpenSearchModal"
    >
      <SelectFake @click="handleOpenModalitiesModal"> {{ modality.name }} </SelectFake>
    </Header>
    <section class="home__body">
      <SelectFake
        class="home__league-select"
        titleSize="medium"
        @click="handleOpenLeaguesModal"
      >
        <img v-if="league.image" :src="league.image">
        <span>{{ league.title }}</span>
      </SelectFake>

      <GameList :data="championshipList" />
    </section>

    <ModalLeagues
      v-if="showModalLeagues"
      :items="championshipPerRegionList"
      @closeModal="handleCloseLeaguesModal"
      @click="handleLeague"
    />

    <ModalModalities
      v-if="showModalModalities"
      :modalityId="modality.id"
      @closeModal="handleCloseModalitiesModal"
      @click="handleModality"
    />

    <ModalCalendar
      v-if="showModalCalendar"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />

    <ModalSearch
      v-if="showModalSearch"
      @closeModal="handleCloseSearchModal"
      @change="handleSearch"
    />
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import { modalityList, championshipList, leagueList } from '@/constants'
import ModalLeagues from './parts/ModalLeagues.vue'
import ModalModalities from './parts/ModalModalities.vue'
import ModalCalendar from './parts/ModalCalendar.vue'
import ModalSearch from './parts/ModalGameSearch.vue'
import GameList from './parts/GameList.vue'
import { getChampionShipBySportId, getChampionShipRegionBySportId } from '@/services'
import { useHomeStore } from '@/stores'

const MODALITY_SPORT_FUTEBOL = 1;

export default {
  name: 'home',
  components: {
    Header,
    SelectFake,
    ModalLeagues,
    ModalModalities,
    ModalCalendar,
    ModalSearch,
    GameList,
  },
  data() {
    return {
      showModalSearch: false,
      showModalCalendar: false,
      showModalLeagues: false,
      showModalModalities: false,
      modality: null,
      league: leagueList[0],
      modalityList,
      championshipList,
      leagueList,

      homeStore: useHomeStore()
    }
  },
  created() {
    this.handleModality(MODALITY_SPORT_FUTEBOL)
  },
  computed: {
    championshipPerRegionList() {
      return this.homeStore.championshipPerRegionList;
    }
  },
  methods: {
    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    async handleModality(modalityId) {
      this.modality = this.modalityList.find(modality => modality.id === modalityId)
      this.handleCloseModalitiesModal();
      // const championships = await getChampionShipBySportId(this.modality.id);

      this.prepareChampionshipPerRegionList(modalityId);
    },

    handleOpenLeaguesModal() {
      this.showModalLeagues = true;
    },
    handleCloseLeaguesModal() {
      this.showModalLeagues = false;
    },
    handleLeague(leagueName) {
      this.league = this.leagueList.find(league => league.title === leagueName)
      this.handleCloseLeaguesModal()
    },

    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    handleCalendar(dateTime) {
      console.log(dateTime)
      this.handleCloseCalendarModal()
    },

    handleOpenSearchModal() {
      this.showModalSearch = true
    },
    handleCloseSearchModal() {
      this.showModalSearch = false
    },
    handleSearch(gameId) {
      console.log(gameId)
    },

    async prepareChampionshipPerRegionList(modalityId) {
      let championshipPerRegion = await getChampionShipRegionBySportId(modalityId);
      championshipPerRegion = championshipPerRegion.result.map((region) => {
        region.campeonatos.push({
          _id: `region_${region._id}`,
          nome: `Todos os campeonatos - ${region._id}`
        })
        region.image = `https://cdn.wee.bet/flags/1x1/${region.sigla}.svg`;
        return region;
      });

      championshipPerRegion.push({
        _id: "Todos os campeonatos",
        sigla: "ww",
        image: `https://cdn.wee.bet/flags/1x1/ww.svg`,
        campeonatos: []
      })

      this.homeStore.setChampionshipPerRegionList(championshipPerRegion)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 100px;
  &__body {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__league-select {
    padding: 8px 16px;
  }

  &__league-select img {
    width: 16px;
    height: 16px;
  }
}
</style>