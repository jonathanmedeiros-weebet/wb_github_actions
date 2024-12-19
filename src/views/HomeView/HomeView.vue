<template>
  <div class="home">
    <Header
      :showCalendarButton="showCalendarButton"
      :showSearchButton="showSearchButton"
      @calendarClick="handleOpenCalendarModal"
      @searchClick="handleOpenSearchModal"
    >
      <SelectFake @click="handleOpenModalitiesModal"> {{ modality?.name }} </SelectFake>

      <template #actions> 
        <LiveButton
          v-if="hasLive"
          :actived="liveActived"
          @click.native="handleLive"
        />
      </template>
    </Header>

    <SportModality ref="sport-modality" v-if="isSportModality"/>
    <PopularLotteryModality ref="popular-lottery-modality" v-if="isPopularLotteryModality"/>
    <LotteryModality ref="lottery-modality" v-if="isLotteryModality"/>

    <ModalModalities
      v-if="showModalModalities"
      :modalityId="modality?.id"
      :isLive="liveActived"
      @closeModal="handleCloseModalitiesModal"
      @click="handleModality"
    />

    <ModalCalendar
      v-if="showModalCalendar"
      :initialDate="dateSelected"
      :maxDate="tablelimiteDate"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />

    <ModalSearch
      v-if="showModalSearch"
      @closeModal="handleCloseSearchModal"
      @click="handleSearchModal"
    />
  </div>
</template>

<script>
import { modalityList, getModalitiesEnum } from '@/constants'
import { useConfigClient, useHomeStore, useToastStore } from '@/stores'

import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import ModalModalities from './parts/ModalModalities.vue'
import ModalCalendar from './parts/ModalCalendar.vue'
import ModalSearch from './parts/ModalGameSearch.vue'

import LiveButton from './parts/LiveButton.vue'
import Toast from '@/components/Toast.vue'
import scrollMixin from '@/mixins/scroll.mixin'
import SportModality from './SportModality/SportModality.vue'
import PopularLotteryModality from './PopularLotteryModality/PopularLotteryModality.vue'
import LotteryModality from './LotteryModality/LotteryModality.vue'

export default {
  name: 'home',
  mixins: [scrollMixin],
  components: {
    Header,
    SelectFake,
    ModalModalities,
    ModalCalendar,
    ModalSearch,
    LiveButton,
    Toast,
    SportModality,
    PopularLotteryModality,
    LotteryModality
  },
  data() {
    return {
      showModalSearch: false,
      showModalCalendar: false,
      showModalModalities: false,
      modalityList: modalityList(),
      homeStore: useHomeStore(),
      toastStore: useToastStore(),
    }
  },
  activated() {
    this.onInit(false);
  },
  computed: {
    showCalendarButton() {
      return this.isSportModality && !this.liveActived;
    },
    showSearchButton() {
      return this.isSportModality;
    },
    hasLive() {
      const { options } = useConfigClient();
      if(!options.aovivo) return false;

      if(this.modality?.id == this.Modalities.FOOTBALL && options.futebol_aovivo) return true;
      if(this.modality?.id == this.Modalities.BASKETBALL && options.basquete_aovivo) return true;
      
      return false;
    },
    liveActived() {
      return this.homeStore.isLive;
    },
    modality() {
      return this.homeStore.modality;
    },
    isLotteryModality() {
      return this.Modalities.LOTTERY == this.modality?.id;
    },
    isSportModality() {
      return [
        this.Modalities.AMERICAN_FOOTBALL,
        this.Modalities.BASKETBALL,
        this.Modalities.COMBAT,
        this.Modalities.E_SPORTS,
        this.Modalities.FOOTBALL,
        this.Modalities.FUTSAL,
        this.Modalities.ICE_HOCKEY,
        this.Modalities.TABLE_TENNIS,
        this.Modalities.TENNIS,
        this.Modalities.VOLLEYBALL
      ].includes(this.modality?.id);
    },
    isPopularLotteryModality() {
      return this.Modalities.POPULAR_LOTTERY == this.modality?.id;
    },
    dateSelected() {
      return this.homeStore.date;
    },
    Modalities() {
      return getModalitiesEnum();
    },
    tablelimiteDate () {
      const { options } = useConfigClient();
      return options?.data_limite_tabela ?? 1
    }
  },
  methods: {
    onInit() {
      if(!Boolean(this.modality)) {
        const modality = this.modalityList.find(modality => modality.id === this.Modalities.FOOTBALL);
        this.homeStore.setModality(modality);
      }
    },

    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    async handleModality(modalityId) {
      const modality = this.modalityList.find(modality => modality.id === modalityId);
      this.homeStore.setModality(modality);

      if(this.isPopularLotteryModality){
        setTimeout(() => this.$refs['popular-lottery-modality'].loadPage(), 500);
      }

      if(modalityId === this.Modalities.LOTTERY){
        return; 
      }

      if(this.isSportModality) {
        this.homeStore.setLeague(null);
        setTimeout(() => this.$refs['sport-modality'].onInit(true), 500);
      }

      this.handleCloseModalitiesModal();
    },

    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    async handleCalendar(dateTime) {
      this.loading = true;
      this.homeStore.setDate(dateTime);
      this.handleCloseCalendarModal();
      
      if(this.isSportModality) {
        this.$refs['sport-modality'].onInit(true);
      }
    },

    handleOpenSearchModal() {
      this.showModalSearch = true,
      this.homeStore.setSelectedSearch(true);
      this.homeStore.setInSearch(true);
    },
    handleCloseSearchModal() {
      this.showModalSearch = false
      this.homeStore.selectedSearch = false;
      this.$refs['sport-modality'].pageLoad();
    },
    handleSearchModal(gameId) {
      this.$refs['sport-modality'].handleGameDetailClick(gameId);
    },
    handleLive() {
      this.homeStore.setIsLive(!this.liveActived);
      this.homeStore.setInSearch(!this.homeStore.inSearch);
      this.homeStore.setLeague(null);
      this.$refs['sport-modality'].prepareSocket();
      this.$refs['sport-modality'].pageLoad();
    },

    handleCloseToast() {
      this.toastStore.setToastConfig({ message: '' });
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  &__body {
    display: flex;
    flex-direction: column;
  }

  &__league-select {
    padding: 8px 16px;
  }

  &__league-select img {
    width: 16px;
    height: 16px;
    border-radius: 50px;
    margin-right: 8px;
  }

  &__league-select svg {
    width: 18px;
    height: 18px;
    border-radius: 50px;
    margin-right: 8px;
    margin-left: -1px;
  }
}
</style>