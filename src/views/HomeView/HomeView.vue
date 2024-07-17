<template>
  <div class="home">
    <Header
      :showCalendarButton="!liveActived"
      :showSearchButton="true"
      @calendarClick="handleOpenCalendarModal"
      @searchClick="handleOpenSearchModal"
    >
      <SelectFake @click="handleOpenModalitiesModal"> {{ modality.name }} </SelectFake>

      <template #actions> 
        <LiveButton
          v-if="hasLive"
          :actived="liveActived"
          @click.native="handleLive"
        />
      </template>
    </Header>
    <section class="home__body">
      <GameListSkeleton v-if="loading"/>

      <template v-else>
        <SelectFake
          class="home__league-select"
          titleSize="medium"
          v-if="!liveActived"
          @click="handleOpenLeaguesModal"
        >
          <img v-if="league.image" :src="league.image"  @error="changeSrcWhenImageError">
          <component v-if="league.icon" :is="league.icon" color="var(--color-primary)" />

          <span>{{ league.label }}</span>
        </SelectFake>

        <GameList />
      </template>
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
      :initialDate="dateSelected"
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
import { now } from '@/utilities'
import { modalityList, leagueList, countriesWithFemaleNames } from '@/constants'
import { getChampionship, getChampionshipBySportId, getChampionshipRegionBySportId, getLiveChampionship } from '@/services'
import { useHomeStore } from '@/stores'

import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import ModalLeagues from './parts/ModalLeagues.vue'
import ModalModalities from './parts/ModalModalities.vue'
import ModalCalendar from './parts/ModalCalendar.vue'
import ModalSearch from './parts/ModalGameSearch.vue'
import GameList from './parts/GameList.vue'
import IconTrophy from '@/components/icons/IconTrophy.vue'
import IconGlobal from '@/components/icons/IconGlobal.vue'
import GameListSkeleton from '@/views/HomeView/parts/GameListSkeleton.vue'
import IconFootball from '@/components/icons/IconFootball.vue'
import IconCombat from '@/components/icons/IconCombat.vue'
import IconAmericanFootball from '@/components/icons/IconAmericanFootball.vue'
import IconTennis from '@/components/icons/IconTennis.vue'
import IconHockey from '@/components/icons/IconHockey.vue'
import IconBasketball from '@/components/icons/IconBasketball.vue'
import IconFutsal from '@/components/icons/IconFutsal.vue'
import IconVoleiball from '@/components/icons/IconVoleiball.vue'
import IconESport from '@/components/icons/IconESport.vue'
import { Modalities } from '@/enums'
import LiveButton from './parts/LiveButton.vue'

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
    IconGlobal,
    GameListSkeleton,
    IconFootball,
    IconCombat,
    IconAmericanFootball,
    IconTennis,
    IconHockey,
    IconBasketball,
    IconFutsal,
    IconVoleiball,
    IconESport,
    LiveButton
  },
  data() {
    return {
      showModalSearch: false,
      showModalCalendar: false,
      showModalLeagues: false,
      showModalModalities: false,
      liveActived: false,
      loading: false,
      modality: null,
      league: leagueList[0],
      modalityList: modalityList(),
      dateSelected: now(),
      regionSelected: '',
      homeStore: useHomeStore()
    }
  },
  created() {
    this.modality = this.modalityList.find(modality => modality.id === Modalities.SOCCER);
    this.pageLoad();
  },
  computed: {
    championshipPerRegionList() {
      return this.homeStore.championshipPerRegionList;
    },
    hasLive() {
      return [Modalities.SOCCER, Modalities.BACKETBALL].includes(this.modality.id);
    }
  },
  methods: {
    async pageLoad() {
      this.loading = true;
      await this.prepareChampionshipList(this.modality.id, true, null, this.dateSelected.format('YYYY-MM-DD'));
      await this.prepareChampionshipPerRegionList(this.modality.id);
      this.loading = false;
    },

    async prepareChampionshipPerRegionList(modalityId) {
      if(this.liveActived) return [];

      const championshipPerRegion = await getChampionshipRegionBySportId(modalityId);
      const championshipPerRegionList = championshipPerRegion.result.map((region) => {
        const isIcon = ['ww', 'all'].includes(region.sigla);
        const iconComponent = region.sigla === 'ww' ? IconGlobal : IconTrophy;

        const championships = region.campeonatos.map(({_id, nome}) => ({
          id: _id,
          name: nome.replace(`${region._id}: `, '').toUpperCase(),
          label: nome.toUpperCase(),
          image: !isIcon ? `https://cdn.wee.bet/flags/1x1/${region.sigla}.svg` : null,
          icon: isIcon ? iconComponent : null
        }));

        championships.unshift({
          id: `region_${region._id}`,
          name: `TODOS OS CAMPEONATOS ${this.prepareCountryName(region._id)}`.toUpperCase(),
          label: region._id.toUpperCase(),
          image: !isIcon ? `https://cdn.wee.bet/flags/1x1/${region.sigla}.svg` : null,
          icon: isIcon ? iconComponent : null
        })

        return {
          id: `region_${region._id}`,
          name: region._id.toUpperCase(),
          label: region._id.toUpperCase(),
          slug: region.sigla,
          image: !isIcon ? `https://cdn.wee.bet/flags/1x1/${region.sigla}.svg` : null,
          icon: isIcon ? iconComponent : null,
          championships
        };
      });

      championshipPerRegionList.unshift({
        id: "region_ALL",
        name: "TODOS OS CAMPEONATOS".toUpperCase(),
        label: "TODOS OS CAMPEONATOS".toUpperCase(),
        slug: "all",
        image: null,
        icon: IconGlobal,
        championships: []
      });

      this.homeStore.setChampionshipPerRegionList(championshipPerRegionList);

      const league = championshipPerRegionList[0];
      delete league?.championships;
      this.league = league;

      if(this.modality.id !== Modalities.SOCCER) {
        this.prepareChampionshipPerRegionListForModalityOtherThanFootball();
      }
    },
    prepareChampionshipPerRegionListForModalityOtherThanFootball() {
      const icons = {
        1: IconFootball,
        9: IconCombat,
        12: IconAmericanFootball,
        13: IconTennis,
        17: IconHockey,
        48242: IconBasketball,
        83: IconFutsal,
        91: IconVoleiball,
        92: IconTennis,
        151: IconESport
      }

      const icon = icons[this.modality.id] ?? null;
    
      const championships = this.homeStore.championshipList.map((championship) => {
        return {
          id: championship._id,
          name: championship.nome.toUpperCase(),
          label: championship.nome.toUpperCase(),
          image: null,
          icon
        }
      })

      const championshipPerRegionList = this.homeStore.championshipPerRegionList;
      championshipPerRegionList[0].championships = championships;
      this.homeStore.setChampionshipPerRegionList(championshipPerRegionList)
    },
    async prepareChampionshipList(
      modalityId,
      popularLeague = false,
      regionName = null,
      dateSelected= null
    ) {
      const championships = this.liveActived
        ? await getLiveChampionship(modalityId)
        : await getChampionshipBySportId(
          modalityId,
          regionName,
          dateSelected,
          popularLeague
        );

      this.homeStore.setChampionshipList(championships);
    },
    async prepareChampionship(championshipId) {
      const championship = await getChampionship(championshipId);
      this.homeStore.setChampionshipList([championship.result])
    },
    prepareCountryName(countryName) {
      return countriesWithFemaleNames.includes(countryName.toUpperCase()) ? `da ${countryName}` : `do ${countryName}`;
    },

    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    async handleModality(modalityId) {
      this.loading = true;
      this.modality = this.modalityList.find(modality => modality.id === modalityId)
      this.handleCloseModalitiesModal();

      await this.prepareChampionshipPerRegionList(modalityId);
      await this.prepareChampionshipList(modalityId, false, null, this.dateSelected.format('YYYY-MM-DD'));
      this.loading = false;
    },

    handleOpenLeaguesModal() {
      this.showModalLeagues = true;
    },
    handleCloseLeaguesModal() {
      this.showModalLeagues = false;
    },
    async handleLeague(regionOrChampionship) {
      this.loading = true;
      this.regionSelected = '';

      const searchTypeIsRegion = regionOrChampionship.id.includes('region');
      this.handleCloseLeaguesModal();

      if(searchTypeIsRegion) {
        let regionName = regionOrChampionship.id;
        regionName = regionName.split('region_').pop();
        regionName = regionName != 'ALL' ? regionName : null;

        this.regionSelected = regionName;
        await this.prepareChampionshipList(this.modality.id, false, regionName);
      } else {
        await this.prepareChampionship(regionOrChampionship.id);
      }

      delete regionOrChampionship?.championships;
      this.league = regionOrChampionship;
      this.loading = false;
    },

    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    async handleCalendar(dateTime) {
      this.loading = true;
      this.dateSelected = dateTime;
      this.handleCloseCalendarModal();

      await this.prepareChampionshipList(
        this.modality.id,
        false,
        this.regionSelected,
        this.dateSelected.format('YYYY-MM-DD')
      );

      this.loading = false;
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
    },

    handleLive() {
      this.liveActived = !this.liveActived;
      this.pageLoad();
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
    border-radius: 50px;
  }
}
</style>