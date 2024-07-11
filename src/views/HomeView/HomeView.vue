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
        <img v-if="league.image" :src="league.image"  @error="changeSrcWhenImageError">
        <span>{{ league.title }}</span>
      </SelectFake>

      <GameList />
    </section>

    <ModalLeagues
      v-if="showModalLeagues"
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
import { modalityList, leagueList } from '@/constants'
import ModalLeagues from './parts/ModalLeagues.vue'
import ModalModalities from './parts/ModalModalities.vue'
import ModalCalendar from './parts/ModalCalendar.vue'
import ModalSearch from './parts/ModalGameSearch.vue'
import GameList from './parts/GameList.vue'
import { getChampionshipBySportId, getChampionshipRegionBySportId } from '@/services'
import { useHomeStore } from '@/stores'
import IconTrophy from '@/components/icons/IconTrophy.vue'
import IconGlobal from '@/components/icons/IconGlobal.vue'

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
    IconTrophy,
    IconGlobal
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

      homeStore: useHomeStore()
    }
  },
  created() {
    this.modality = this.modalityList.find(modality => modality.id === MODALITY_SPORT_FUTEBOL);
    this.prepareChampionshipPerRegionList(this.modality.id);
    this.prepareChampionshipList(this.modality.id, true);
  },
  computed: {
    championshipPerRegionList() {
      return this.homeStore.championshipPerRegionList;
    }
  },
  methods: {
    async prepareChampionshipPerRegionList(modalityId) {
      const championshipPerRegion = await getChampionshipRegionBySportId(modalityId);
      this.homeStore.setChampionshipPerRegionList(championshipPerRegion.result);
    },

    async prepareChampionshipList(modalityId, popularLeague = false) {
      const regionSelected = this.homeStore.regionSelected;
      const dateSelected = this.homeStore.dateSelected;

      const championships = await getChampionshipBySportId(
        modalityId,
        regionSelected?.name ?? null,
        dateSelected,
        popularLeague
      );

      this.homeStore.setChampionshipList(championships.result)
    },

    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    async handleModality(modalityId) {
      this.modality = this.modalityList.find(modality => modality.id === modalityId)
      this.handleCloseModalitiesModal();

      this.prepareChampionshipPerRegionList(modalityId);
      this.prepareChampionshipList(modalityId);
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
    changeSrcWhenImageError (event) {
      event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
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